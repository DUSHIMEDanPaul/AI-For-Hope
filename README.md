# AI for Hope

**Offline-first skin condition screening, designed for low-connectivity settings.**

AI for Hope is a mobile skin-condition classifier built to run entirely on-device, without an internet connection. It is being developed with deployment at [Mahama Refugee Camp](https://en.wikipedia.org/wiki/Mahama_Refugee_Camp) in mind — a setting where dermatological expertise is scarce and reliable connectivity cannot be assumed. The goal is a lightweight, resilient screening aid that works where cloud-dependent tools cannot.

> **Status:** Active development. The model and pipeline are functional; the project has not yet been deployed in the field. See [Project Status](#project-status) below.

---

## Why this project exists

Access to dermatological care is deeply uneven. In many refugee and rural settings, a single clinician may serve tens of thousands of people, and specialist referral can take weeks. Skin conditions that are easy to triage early — but dangerous if missed — often go unassessed.

Most AI dermatology tools assume two things that don't hold in these environments: a stable internet connection, and training data that represents the population being served. Public dermatology datasets are overwhelmingly built from lighter-skinned patients — so a model trained on them fails the exact people this tool is meant to help. AI for Hope is an attempt to design *against* both of those assumptions from the start, with **building a representative, locally-collected dataset as a core objective** rather than an afterthought.

Two constraints shaped every technical decision:

1. **No connectivity.** The model must run on a modest smartphone with no server round-trips.
2. **Representative performance.** A screening tool that works well on light skin and poorly on dark skin is not just less useful — it actively deepens the inequity it's meant to reduce.

---

## What it does

- Classifies an input image of a skin lesion into one of the HAM10000 diagnostic categories.
- Runs **fully offline** on-device — no data leaves the phone.
- Applies **skin-tone bias correction** so performance degrades less across the tone spectrum.
- Ships as a **quantized model** small enough to run on low-end hardware.

AI for Hope is a **screening and triage aid, not a diagnostic device.** It is intended to help prioritize who should see a clinician sooner — not to replace one. See [Responsible use](#responsible-use--limitations).

---

## Technical approach

### Model

- **Architecture:** MobileNetV2 via transfer learning — chosen specifically because it is designed for mobile and embedded inference, giving a strong accuracy-to-footprint ratio.
- **Bootstrap dataset:** [HAM10000](https://doi.org/10.1038/sdata.2018.161) ("Human Against Machine with 10,000 training images") is used to prototype and establish a baseline. It spans seven diagnostic categories:

  | Code  | Condition                          |
  |-------|------------------------------------|
  | akiec | Actinic keratoses / Bowen's disease |
  | bcc   | Basal cell carcinoma               |
  | bkl   | Benign keratosis-like lesions      |
  | df    | Dermatofibroma                     |
  | mel   | Melanoma                           |
  | nv    | Melanocytic nevi                   |
  | vasc  | Vascular lesions                   |

  HAM10000 is a **starting point, not the destination.** It is skewed toward lighter skin tones, which is precisely the gap this project exists to close.

- **Target dataset (the goal):** collecting a **representative, locally-sourced dataset** that reflects the population at the intended deployment site. This is the central objective of the project — the bias problem isn't something to patch around a public dataset, it's the reason for building a better one.

### Why transfer learning

MobileNetV2 is initialized from **ImageNet-pretrained weights** rather than trained from scratch. This matters most precisely *because* the model is fine-tuned on collected data:

- **Data efficiency.** A locally-collected dataset is realistically in the hundreds-to-low-thousands of images early on — far too few to train millions of parameters from scratch without severe overfitting. The pretrained backbone already knows general visual primitives (edges, textures, color gradients, shapes), so useful performance is achievable from far less data.
- **It's orthogonal to the data source.** The "transfer" comes from ImageNet, not from any dermatology dataset. Moving to our own data doesn't change the case for it — from-scratch only becomes competitive at ~100k+ labeled images, which is not the regime we're in.
- **It doesn't compromise fairness.** ImageNet's low-level features are tone-agnostic; fairness comes from the *fine-tuning* data being representative. Pretraining and building a representative dataset are complementary, not in tension.

### On-device optimization

- **Post-training INT8 quantization** reduces model size by roughly **75%**, bringing the footprint down to something practical for low-end devices while keeping inference fast and accuracy loss small.
- Result: a model that loads and runs on modest hardware with no network dependency.

### Addressing skin-tone bias

HAM10000, like most public dermatology datasets, skews toward lighter skin tones. A model trained naively on it will underperform on darker skin — precisely the population this tool aims to serve. AI for Hope tackles this on two fronts: **skin-tone bias correction** to reduce the gap in the near term, and **collecting a representative local dataset** to address the root cause. The former is mitigation; the latter is the real fix.

> **Note:** Bias mitigation reduces disparity; it does not eliminate it. Reported per-tone metrics should be read as evidence of *improvement*, not of solved fairness. See [Responsible use](#responsible-use--limitations).

---

## Model performance

<!-- Fill in with your actual measured numbers before publishing. Report real, verified figures only. -->

| Metric                         | Value |
|--------------------------------|-------|
| Overall accuracy               | _TBD_ |
| Macro F1                       | _TBD_ |
| Melanoma recall (sensitivity)  | _TBD_ |
| Model size (post-quantization) | _TBD MB_ |
| Median inference time on-device | _TBD ms_ |

For a screening tool, **recall on high-risk classes (e.g. melanoma) matters more than headline accuracy** — a false negative is far costlier than a false positive here. Consider reporting the confusion matrix and per-tone breakdown alongside the aggregate numbers.

---

## Getting started

> Adjust the commands below to match your repository's actual structure.

### Prerequisites

- Python 3.9+
- TensorFlow / TensorFlow Lite
- The HAM10000 dataset (see [Dataset](#dataset--acknowledgments))

### Setup

```bash
git clone https://github.com/DUSHIMEDanPaul/ai-for-hope.git
cd ai-for-hope

python -m venv venv
source venv/bin/activate        # Windows: venv\Scripts\activate

pip install -r requirements.txt
```

### Training / reproducing the model

```bash
python train.py --data path/to/ham10000
```

### Exporting the quantized model

```bash
python quantize.py --model checkpoints/best.h5 --out models/ai_for_hope_int8.tflite
```

### Running inference

```bash
python predict.py --image samples/lesion.jpg --model models/ai_for_hope_int8.tflite
```

---

## Project structure

```
ai-for-hope/
├── data/                 # Dataset loaders & preprocessing
├── models/               # Exported (quantized) models
├── src/
│   ├── train.py          # Training pipeline
│   ├── quantize.py       # Post-training INT8 quantization
│   ├── bias_correction/  # Skin-tone bias mitigation
│   └── predict.py        # On-device inference
├── notebooks/            # Experiments & analysis
├── requirements.txt
└── README.md
```

---

## Project status

AI for Hope is in **active development**. The current state:

- ✅ MobileNetV2 transfer-learning pipeline (baseline on HAM10000)
- ✅ INT8 quantization (~75% size reduction)
- ✅ Skin-tone bias correction
- 🔲 Representative, locally-collected dataset
- 🔲 Mobile application wrapper for field use
- 🔲 Clinical validation against ground-truth diagnoses
- 🔲 Field deployment at Mahama Refugee Camp

It has **not** been deployed in a live clinical setting. Mahama is the intended deployment context, not a completed rollout.

### Roadmap

- Collect a representative, locally-sourced dataset with proper consent and clinician-verified labels.
- Retrain and validate on a held-out, tone-diverse test set and publish per-tone metrics.
- Package the model into a standalone offline mobile app.
- Pilot with clinicians for real-world usability and safety review.
- Build a feedback loop so field corrections can improve future model versions.

---

## Responsible use & limitations

**AI for Hope is a screening aid, not a medical device, and not a substitute for professional diagnosis.** It has not been clinically validated or approved by any regulatory body.

- Outputs are probabilistic suggestions to support triage — never a final diagnosis.
- The model can be wrong, including confident wrong answers, especially on conditions or presentations underrepresented in HAM10000.
- Performance varies across skin tones despite bias correction; the disparity is reduced, not removed.
- Any concerning result should be escalated to a qualified clinician.

If you build on or deploy this project, treat clinical validation and clinician oversight as prerequisites, not optional extras.

---

## Dataset & acknowledgments

- **HAM10000** — Tschandl, P., Rosendahl, C. & Kittler, H. *The HAM10000 dataset, a large collection of multi-source dermatoscopic images of common pigmented skin lesions.* Sci Data 5, 180161 (2018). https://doi.org/10.1038/sdata.2018.161
- Built on **MobileNetV2** (Sandler et al., 2018) and **TensorFlow / TensorFlow Lite**.

_The dataset citation above is from the published record; please verify it against the current source before including it in any formal write-up._

---

## License

<!-- Choose and add a license (e.g. MIT, Apache-2.0) and include the LICENSE file. -->
_License TBD._

---

## Contact

Built by **Dan Paul Dushime** — [@DUSHIMEDanPaul](https://github.com/DUSHIMEDanPaul)

Feedback, issues, and questions are welcome via the repository's issue tracker.
