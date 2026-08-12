from datetime import datetime, timezone


def run() -> dict:
    now = datetime.now(timezone.utc)
    return {
        "status": "OK",
        "message": "Python GitHub Actions runner is alive",
        "timestamp_utc": now.isoformat(),
    }


if __name__ == "__main__":
    result = run()
    print(f"[{result['timestamp_utc']}] {result['status']}: {result['message']}")
