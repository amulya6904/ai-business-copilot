from pathlib import Path
import sys


sys.path.insert(0, str(Path(__file__).resolve().parents[1]))

from core.llm.schema import validate_insight


sample = {
    "title": "Increased Revenue in Category X",
    "summary": "Revenue growth from A to B observed in Category X",
    "key_drivers": ["Positive shift (+10%) in Category X's revenue contribution"],
    "actions": [
        "Continue focusing on Category X, consider implementing strategy Y for further growth."
    ],
    "risks": [
        "Potential risk of oversaturation or stagnation in Category X if strategy Y is not adjusted accordingly."
    ],
}

print(validate_insight(sample))
print("OK")
