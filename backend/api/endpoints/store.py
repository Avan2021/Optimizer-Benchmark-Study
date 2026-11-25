import os
import json

BASE_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))
UPLOAD_DIR = os.path.join(BASE_DIR, "uploaded_runs")
METRICS_DIR = os.path.join(BASE_DIR, "metrics")
os.makedirs(UPLOAD_DIR, exist_ok=True)

runs_db = {}
reports_db = {}


def _infer_optimizer(data, filename=""):
    if isinstance(data, dict):
        if data.get("optimizer") and data["optimizer"] != "unknown":
            return data["optimizer"]
        tl = data.get("train_loss", [])
        if tl:
            if tl[0] > 1.7:
                return "sgd"
            elif tl[0] > 1.4:
                return "sgd_momentum"
            else:
                return "adam"
    if "_" in filename:
        opt_part = filename.rsplit("_", 1)[0]
        if opt_part in ["adam", "sgd", "sgd_momentum"]:
            return opt_part
    return "adam"


def get_run(run_id: str):
    run_id_str = str(run_id)
    if run_id_str in runs_db:
        return runs_db[run_id_str]

    # Check on disk in uploaded_runs
    if os.path.exists(UPLOAD_DIR):
        for fname in os.listdir(UPLOAD_DIR):
            if fname.endswith(".json"):
                stem = fname[:-5]
                parts = stem.rsplit("_", 1)
                file_run_id = parts[1] if len(parts) > 1 else parts[0]
                if file_run_id == run_id_str:
                    file_path = os.path.join(UPLOAD_DIR, fname)
                    data = {}
                    try:
                        with open(file_path, "r") as f:
                            data = json.load(f)
                    except Exception:
                        pass
                    optimizer = _infer_optimizer(data, fname)
                    run_info = {
                        "optimizer": optimizer,
                        "file_path": file_path,
                        "status": "COMPLETED"
                    }
                    runs_db[run_id_str] = run_info
                    return run_info
    return None


def list_all_runs():
    runs_list = []
    seen = set()
    if os.path.exists(UPLOAD_DIR):
        for fname in sorted(os.listdir(UPLOAD_DIR)):
            if fname.endswith(".json"):
                stem = fname[:-5]
                parts = stem.rsplit("_", 1)
                file_run_id = parts[1] if len(parts) > 1 else parts[0]
                if file_run_id not in seen:
                    seen.add(file_run_id)
                    info = get_run(file_run_id)
                    if info:
                        epochs = 0
                        final_acc = 0.0
                        try:
                            with open(info["file_path"], "r") as f:
                                d = json.load(f)
                            epochs = len(d.get("train_loss", []))
                            val_acc = d.get("val_acc", [])
                            if val_acc:
                                final_acc = float(val_acc[-1])
                        except Exception:
                            pass
                        runs_list.append({
                            "run_id": file_run_id,
                            "optimizer": info["optimizer"],
                            "status": info.get("status", "COMPLETED"),
                            "epochs": epochs,
                            "final_test_accuracy": final_acc,
                            "file_path": info["file_path"]
                        })
    return runs_list
