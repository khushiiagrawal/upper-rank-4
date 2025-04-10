import os
import numpy as np
from flask import Flask, render_template, request, redirect, url_for
from PIL import Image
import io
import uuid
from tensorflow.keras.models import load_model
from tensorflow.keras.preprocessing.image import load_img, img_to_array
from tensorflow.keras.applications.resnet50 import preprocess_input

app = Flask(__name__)
app.config['UPLOAD_FOLDER'] = 'static/uploads'
app.config['ALLOWED_EXTENSIONS'] = {'png', 'jpg', 'jpeg'}

# Ensure the upload folder exists
os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)

# Class names based on the dataset directory structure (alphabetical order)
class_names = [
    'aerosol_cans',
    'aluminum_food_cans',
    'aluminum_soda_cans',
    'cardboard_boxes',
    'cardboard_packaging',
    'clothing',
    'coffee_grounds',
    'disposable_plastic_cutlery',
    'eggshells',
    'food_waste',
    'glass_beverage_bottles',
    'glass_cosmetic_containers',
    'glass_food_jars',
    'magazines',
    'newspaper',
    'office_paper',
    'paper_cups',
    'plastic_cup_lids',
    'plastic_detergent_bottles',
    'plastic_food_containers',
    'plastic_shopping_bags',
    'plastic_soda_bottles',
    'plastic_straws',
    'plastic_trash_bags',
    'plastic_water_bottles',
    'shoes',
    'steel_food_cans',
    'styrofoam_cups',
    'styrofoam_food_containers',
    'tea_bags'
]

# Path to the model
MODEL_PATH = '3RVision.keras'

# Load the actual Keras model
try:
    model = load_model(MODEL_PATH)
    print("Keras model loaded successfully.")
    # Print model summary to verify structure
    print("--- Model Summary ---")
    model.summary() 
    print("---------------------")
except Exception as e:
    print(f"Error loading Keras model: {e}")
    # If the model fails to load, provide a fallback or raise an error
    # For now, let's print the error and proceed, which might cause issues later
    model = None 

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in app.config['ALLOWED_EXTENSIONS']

def preprocess_image(image_path, target_size=(224, 224)):
    """Preprocess the image using ResNet50 standards."""
    # Load the image using Keras utility
    img = load_img(image_path, target_size=target_size)
    
    # Convert the image to a numpy array
    img_array = img_to_array(img)
    
    # Add a batch dimension
    img_array = np.expand_dims(img_array, axis=0)
    
    # Preprocess the image using ResNet50's specific function
    img_array = preprocess_input(img_array)
    
    return img_array

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/upload', methods=['POST'])
def upload_file():
    if 'file' not in request.files:
        return redirect(request.url)
    
    file = request.files['file']
    
    if file.filename == '':
        return redirect(request.url)
    
    if file and allowed_file(file.filename):
        # Create a unique filename
        ext = file.filename.rsplit('.', 1)[1].lower()
        filename = f"{uuid.uuid4().hex}.{ext}"
        file_path = os.path.join(app.config['UPLOAD_FOLDER'], filename)
        
        # Save the file
        file.save(file_path)
        
        # Ensure model is loaded before predicting
        if model is None:
            print("Model not loaded, cannot predict.")
            return redirect(url_for('index'))

        try:
            # Make prediction using the loaded Keras model
            preprocessed_img = preprocess_image(file_path)
            
            # --- DEBUGGING: Check preprocessed image --- 
            print(f"DEBUG: Preprocessed image shape: {preprocessed_img.shape}, dtype: {preprocessed_img.dtype}")
            # Add stats for the preprocessed array
            print(f"DEBUG: Preprocessed stats: mean={np.mean(preprocessed_img):.4f}, std={np.std(preprocessed_img):.4f}, min={np.min(preprocessed_img):.4f}, max={np.max(preprocessed_img):.4f}")
            # --- END DEBUGGING --- 
            
            predictions = model.predict(preprocessed_img)
            
            # --- DEBUGGING: Check raw model output --- 
            print(f"DEBUG: Raw predictions vector: {predictions[0]}") 
            # --- END DEBUGGING --- 
            
            predicted_class_idx = np.argmax(predictions[0])
            predicted_class = class_names[predicted_class_idx]
            confidence = float(predictions[0][predicted_class_idx]) * 100
            
            return render_template('result.html', 
                                filename=filename, 
                                predicted_class=predicted_class,
                                confidence=confidence)
        except Exception as e:
            # In case of error during prediction
            print(f"Error during prediction: {e}")
            return redirect(url_for('index'))
    
    return redirect(url_for('index'))

if __name__ == '__main__':
    # Make sure the app runs only if the model loaded successfully
    if model is not None:
        app.run(debug=True)
    else:
        print("Application cannot start because the model failed to load.") 