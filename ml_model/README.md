# TrashNet Garbage Classification App

A web application for classifying garbage images using a pre-trained Keras model on the TrashNet dataset.

## Features

- Upload images via drag-and-drop or file browser
- Image preview before classification
- Classification of garbage into 6 categories:
  - Cardboard
  - Glass
  - Metal
  - Paper
  - Plastic
  - Trash (non-recyclable)
- Displays classification results with confidence score
- Provides recycling information based on the classification

## Requirements

- Python 3.10 (or 3.9, 3.11, 3.12)
- Flask
- TensorFlow (CPU or GPU version)
- Pillow (PIL)
- NumPy

## Installation

1. **Create a Virtual Environment (Recommended):**
   It's highly recommended to use a virtual environment with a Python version supported by TensorFlow (e.g., 3.10, 3.11, 3.12).
   ```bash
   # Replace 'py -3.10' with the command for your chosen Python version
   py -3.10 -m venv .venv 
   
   # Activate the environment (PowerShell)
   .\.venv\Scripts\Activate.ps1
   
   # (Alternative for Command Prompt/cmd.exe)
   # .\.venv\Scripts\activate.bat
   ```

2. **Install the required packages:**
   Inside the activated virtual environment, run:
   ```bash
   pip install flask tensorflow pillow numpy
   ```

## Usage

1. **Activate the virtual environment** (if not already active):
   ```bash
   .\.venv\Scripts\Activate.ps1
   ```

2. **Start the application:**
   ```bash
   python app.py
   ```

3. **Open your web browser** and go to `http://127.0.0.1:5000/`
4. **Upload an image** of garbage using the interface.
5. Click **"Classify Image"** to get the classification result based on the Keras model.

## Model

The application uses the `3RVision.keras` model file, which is loaded using TensorFlow/Keras. This model was pre-trained on the TrashNet dataset to classify images into the six specified categories.

## Application Structure

- `app.py`: Main Flask application that loads the Keras model and handles requests.
- `templates/`: HTML templates
  - `index.html`: Home page with upload interface
  - `result.html`: Result page displaying classification
- `static/uploads/`: Directory for storing uploaded images.
- `3RVision.keras`: The pre-trained Keras model file.

## License

This project is provided as is for educational and demo purposes. 