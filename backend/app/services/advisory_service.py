from typing import Dict, Any, List

def generate_crop_advisory(crop_name: str, inputs: Dict[str, float], crop_stats: Dict[str, Any] = None) -> Dict[str, Any]:
    n = inputs.get('N', 0.0)
    p = inputs.get('P', 0.0)
    k = inputs.get('K', 0.0)
    temp = inputs.get('temperature', 0.0)
    humidity = inputs.get('humidity', 0.0)
    ph = inputs.get('ph', 7.0)
    rainfall = inputs.get('rainfall', 0.0)

    # 1. Soil Status
    soil_parts = []
    if ph < 5.5:
        soil_parts.append("Acidic soil detected. Agricultural lime addition may improve nutrient uptake.")
    elif ph > 7.5:
        soil_parts.append("Alkaline soil detected. Organic matter or gypsum can help balance pH.")
    else:
        soil_parts.append(f"Soil pH ({ph:.2f}) is in a neutral, healthy range.")

    npk_total = n + p + k
    if npk_total < 80:
        soil_parts.append("Low overall macronutrient reserves (N+P+K). Balanced NPK fertilization recommended.")
    elif npk_total > 250:
        soil_parts.append("High soil nutrient fertility level detected.")
    else:
        soil_parts.append("Moderate soil fertility adequate for crop establishment.")
    soil_status = " ".join(soil_parts)

    # 2. Climate Status
    climate_parts = []
    if temp > 32:
        climate_parts.append("High ambient temperatures. Monitor soil moisture to prevent heat stress.")
    elif temp < 15:
        climate_parts.append("Cool temperature regime. Growth rates may be slightly slower.")
    else:
        climate_parts.append(f"Favourable temperature ({temp:.1f}°C) for plant metabolic activity.")

    if humidity > 80:
        climate_parts.append("High relative humidity. Inspect crops regularly for fungal pathogens.")
    elif humidity < 40:
        climate_parts.append("Low humidity. Evapotranspiration demand is high.")
    else:
        climate_parts.append("Optimal relative humidity for crop transpiration.")
    climate_status = " ".join(climate_parts)

    # 3. Key Favourable Conditions
    fav = []
    fav.append(f"Sufficient rainfall supply ({rainfall:.1f} mm) recorded for field analysis.")
    if 6.0 <= ph <= 7.2:
        fav.append(f"Soil pH ({ph:.2f}) maximizes micronutrient bio-availability.")
    if temp >= 20 and temp <= 30:
        fav.append(f"Temperature regime ({temp:.1f}°C) is within ideal physiological boundaries.")
    if n >= 40:
        fav.append(f"Adequate Nitrogen supply ({n:.1f} kg/ha) supports vegetative leaf growth.")

    # 4. Conditions Needing Attention
    attention = []
    if rainfall < 60:
        attention.append(f"Rainfall ({rainfall:.1f} mm) is relatively low. Supplementary drip/sprinkler irrigation may be required.")
    if ph < 5.5 or ph > 7.5:
        attention.append(f"pH level ({ph:.2f}) requires monitoring for optimal nutrient absorption.")
    if p < 20:
        attention.append(f"Phosphorus level ({p:.1f} kg/ha) is low; root establishment may benefit from rock phosphate or DAP.")
    if k < 20:
        attention.append(f"Potassium level ({k:.1f} kg/ha) is low; consider applying Muriate of Potash (MOP) to build stress resistance.")
    if len(attention) == 0:
        attention.append("No critical soil or weather deficits detected for this field configuration.")

    # 5. General Sowing Guidance
    sowing_guidance = (
        f"For {crop_name.capitalize()}, prepare seedbeds with adequate aeration. Ensure uniform seed depth and initial moisture. "
        f"Exact sowing dates and cultivar selection require region-specific agricultural and local weather extension guidance."
    )

    return {
        "soil_status": soil_status,
        "climate_status": climate_status,
        "favourable_conditions": fav,
        "attention_conditions": attention,
        "sowing_guidance": sowing_guidance
    }
