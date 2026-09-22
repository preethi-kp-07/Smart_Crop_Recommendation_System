"""
Optional PySpark Batch Analytics Script
---------------------------------------
This module provides distributed batch analytics capability for large-scale crop datasets.
When processing multi-gigabyte or streaming agricultural telemetry, PySpark can be executed
in standalone or cluster mode to generate class aggregations and feature statistics.

Usage:
    python -m backend.ml.optional_pyspark_analytics
"""

import os
import sys

def run_pyspark_batch_analytics(csv_path: str):
    try:
        from pyspark.sql import SparkSession
        from pyspark.sql.functions import col, mean, stddev, count, min as spark_min, max as spark_max
        
        print(f"Initializing PySpark Session for dataset: {csv_path}...")
        spark = SparkSession.builder \
            .appName("SmartCropAI-BigDataAnalytics") \
            .config("spark.master", "local[*]") \
            .getOrCreate()
            
        df = spark.read.csv(csv_path, header=True, inferSchema=True)
        print(f"PySpark successfully loaded dataset with schema:")
        df.printSchema()
        
        print("\n--- Distributed Class Summary (PySpark Aggregation) ---")
        summary_df = df.groupBy("label").agg(
            count("*").alias("sample_count"),
            mean("N").alias("avg_nitrogen"),
            mean("P").alias("avg_phosphorus"),
            mean("K").alias("avg_potassium"),
            mean("rainfall").alias("avg_rainfall"),
            mean("temperature").alias("avg_temperature")
        ).orderBy("label")
        
        summary_df.show(25, truncate=False)
        spark.stop()
        print("PySpark batch processing completed successfully.")
        return True
    except ImportError:
        print("[NOTICE] PySpark is not installed in the local environment.")
        print("[INFO] Production environments with >10M rows utilize PySpark batch aggregation jobs.")
        return False
    except Exception as e:
        print(f"[ERROR] PySpark execution encountered error: {str(e)}")
        return False

if __name__ == '__main__':
    csv_file = os.path.join(os.path.dirname(__file__), '..', 'data', 'crop_recommendation.csv')
    run_pyspark_batch_analytics(csv_file)
