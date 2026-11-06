import pandas as pd
import numpy as np
import matplotlib.pyplot as plt

from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
from sklearn.pipeline import make_pipeline
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import (accuracy_score,confusion_matrix,ConfusionMatrixDisplay,classification_report)


#LOAD BOTH DATASETS
df1 = pd.read_csv("student_dropout_preprocessed.csv")
df2 = pd.read_csv("data.csv", sep=";")
print("Both datasets loaded successfully!")

#PREPARE FIRST DATASET
data1 = pd.DataFrame()
data1["Age"] = pd.to_numeric(df1["Age"], errors="coerce")
data1["Gender"] = (
    df1["Gender"].astype(str).str.strip().str.lower().map({"male": 1, "m": 1, "female": 0, "f": 0})
)

data1["Scholarship"] = (
    df1["Scholarship"].astype(str).str.strip().str.lower().map({"yes": 1, "no": 0, "true": 1, "false": 0})
)

#CGPA is already on a 0-4 scale
data1["Performance"] = pd.to_numeric(df1["CGPA"], errors="coerce")
data1["Dropout"] = pd.to_numeric(df1["Dropout"], errors="coerce")


#PREPARE SECOND DATASET
data2 = pd.DataFrame()
data2["Age"] = pd.to_numeric(df2["Age at enrollment"], errors="coerce")
data2["Gender"] = pd.to_numeric(df2["Gender"], errors="coerce")
data2["Scholarship"] = pd.to_numeric(df2["Scholarship holder"], errors="coerce")

grade1 = pd.to_numeric(
    df2["Curricular units 1st sem (grade)"],
    errors="coerce"
)
grade2 = pd.to_numeric(
    df2["Curricular units 2nd sem (grade)"],
    errors="coerce"
)

# Convert average grade from 0-20 to a 0-4 scale
data2["Performance"] = ((grade1 + grade2) / 2) / 5

# Dropout = 1; Enrolled or Graduate = 0
data2["Dropout"] = (
    df2["Target"].astype(str).str.strip().str.lower()
    .eq("dropout")
).astype(int)


# STEP 4: COMBINE BOTH DATASETS
data = pd.concat([data1, data2], ignore_index=True)
data = data.dropna()
data = data[data["Dropout"].isin([0, 1])]

data["Dropout"] = data["Dropout"].astype(int)

X = data[["Age", "Gender", "Scholarship", "Performance"]]
y = data["Dropout"]

print("\nCombined dataset shape:", data.shape)
print("\nTarget distribution:")
print(y.value_counts())


# STEP 5: SPLIT TRAINING AND TESTING DATA
X_train, X_test, y_train, y_test = train_test_split(
    X,
    y,
    test_size=0.2,
    random_state=42,
    stratify=y
)

print("\nTraining records:", len(X_train))
print("Testing records:", len(X_test))

# TRAIN THE MODEL
model = make_pipeline(
    StandardScaler(),
    LogisticRegression(
        class_weight="balanced",
        max_iter=1000
    )
)

model.fit(X_train, y_train)
print("\nModel trained successfully!")


#EVALUATE THE MODEL
y_pred = model.predict(X_test)
accuracy = accuracy_score(y_test, y_pred)


print("\nModel Accuracy:", round(accuracy * 100, 2), "%")
print("\nClassification Report:")
print(classification_report(
    y_test,
    y_pred,
    labels=[0, 1],
    target_names=["Not Dropout", "Dropout"],
    zero_division=0
))

print("Confusion Matrix:")
print(confusion_matrix(y_test, y_pred))

#PLOT TRAINING AND TESTING SPLIT
plt.figure(figsize=(6, 4))
plt.bar(
    ["Training Data", "Testing Data"],
    [len(X_train), len(X_test)]
)

plt.title("Training and Testing Data Split")
plt.ylabel("Number of Students")

plt.tight_layout()
plt.show()


# SPLOT CONFUSION MATRIX

cm = confusion_matrix(y_test, y_pred, labels=[0, 1])

disp = ConfusionMatrixDisplay(
    confusion_matrix=cm,
    display_labels=["Not Dropout", "Dropout"]
)

disp.plot()
plt.title("Student Dropout Prediction")
plt.tight_layout()
plt.show()


#TAKE USER INPUT

print("\n ENTER STUDENT DETAILS")
age = float(input("Enter age: "))
gender_input = input(
    "Enter gender (Male/Female): "
).strip().lower()

if gender_input in ["male", "m"]:
    gender = 1
elif gender_input in ["female", "f"]:
    gender = 0
else:
    raise ValueError("Enter Male or Female.")

scholarship_input = input(
    "Scholarship holder? (Yes/No): "
).strip().lower()

if scholarship_input in ["yes", "y"]:
    scholarship = 1
elif scholarship_input in ["no", "n"]:
    scholarship = 0
else:
    raise ValueError("Enter Yes or No.")

performance = float(input("Enter CGPA out of 4: "))

if age <= 0:
    raise ValueError("Age must be greater than zero.")

if performance < 0 or performance > 4:
    raise ValueError("CGPA must be between 0 and 4.")

user_data = pd.DataFrame([{
    "Age": age,
    "Gender": gender,
    "Scholarship": scholarship,
    "Performance": performance
}])


#  PREDICT DROPOUT
prediction = model.predict(user_data)[0]
probability = model.predict_proba(user_data)[0][1]
print("\nPREDICTION RESULT")

if prediction == 1:
    print("Prediction: Student may drop out.")
else:
    print("Prediction: Student may not drop out.")

print(
    "Estimated dropout probability:",
    round(probability * 100, 2), "%"
)


#  PLOT LOGISTIC REGRESSION PROBABILITY CURVE
cgpa_values = np.linspace(0, 4, 100)
curve_data = pd.DataFrame({
    "Age": age,
    "Gender": gender,
    "Scholarship": scholarship,
    "Performance": cgpa_values
})
dropout_probabilities = (
    model.predict_proba(curve_data)[:, 1] * 100
)

plt.figure(figsize=(8, 5))

# Plot predicted dropout probability
plt.plot(
    cgpa_values,
    dropout_probabilities,
    linewidth=2,
    label="Predicted Dropout Probability"
)

# Show the 50% classification threshold
plt.axhline(
    50,
    color="gray",
    linestyle="--",
    label="50% Threshold"
)

# Mark the user's CGPA
plt.axvline(
    performance,
    color="orange",
    linestyle=":",
    label="Your CGPA"
)

# Mark the user's predicted probability
plt.scatter(
    performance,
    probability * 100,
    color="red",
    s=100,
    zorder=5,
    label="Your Prediction"
)

plt.xlabel("CGPA (0-4)")
plt.ylabel("Estimated Dropout Probability (%)")
plt.title("Logistic Regression: Dropout Probability")
plt.ylim(0, 100)
plt.xlim(0, 4)
plt.legend()
plt.grid(alpha=0.3)
plt.tight_layout()
plt.show()