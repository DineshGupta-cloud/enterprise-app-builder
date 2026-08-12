from app.main import run


def test_run_returns_ok():
    result = run()
    assert result["status"] == "OK"
    assert result["message"] == "Python GitHub Actions runner is alive"
    assert result["timestamp_utc"]
