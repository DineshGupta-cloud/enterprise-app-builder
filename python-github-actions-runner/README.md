# Python GitHub Actions Runner

A small Python project designed to run and test automatically with GitHub Actions.

## Workflows

- `Python Tests`: runs pytest on pushes and pull requests that change this project.
- `Python Scheduled Runner`: runs the Python application every 15 minutes and can also be started manually from GitHub Actions.

## Run locally

```bash
python -m pip install -r requirements.txt
python -m pytest -q
python -m app.main
```

## Important

GitHub-hosted Actions runners are temporary. The scheduled workflow is not a permanent 24/7 process; it starts a fresh runner for each execution. For a true continuously running Python service, use a VPS or self-hosted GitHub Actions runner.

This project is intentionally simple so the application can later be replaced with the NSE/technical scanner logic without changing the CI structure.
