# MailPilot Backend (scaffold)

This folder contains a scaffold of the backend application used by the MailPilot project.

To run locally:

```bash
python3.11 -m venv .venv
source .venv/bin/activate
python -m pip install -r requirements.txt
python -m uvicorn app.main:app --reload
```

On Windows PowerShell, activate the environment with `.venv\Scripts\Activate.ps1` instead.

To install test tools and run the backend tests:

```bash
python -m pip install -r requirements-dev.txt
python -m pytest
```
