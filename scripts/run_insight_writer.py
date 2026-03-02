import argparse
import json
import sys
from pathlib import Path


sys.path.insert(0, str(Path(__file__).resolve().parents[1]))

from core.analytics.insight_writer import write_insight


def main() -> None:
    parser = argparse.ArgumentParser(description="Generate an executive insight from KPI delta JSON.")
    parser.add_argument(
        "--input-file",
        required=True,
        help="Path to a JSON file containing the KPI delta payload.",
    )
    args = parser.parse_args()

    input_path = Path(args.input_file)
    with input_path.open("r", encoding="utf-8") as fh:
        delta = json.load(fh)

    result = write_insight(delta)
    print(json.dumps(result, indent=2))


if __name__ == "__main__":
    main()
