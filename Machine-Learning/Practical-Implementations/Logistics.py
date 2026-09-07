import numpy as np
import matplotlib.pyplot as plt
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import accuracy_score, f1_score

age = np.array([21, 24, 29, 33, 38, 41, 45, 49, 54, 58])

# 1 = Male, 0 = Female
gender = np.array([1, 0, 1, 0, 1, 0, 1, 1, 0, 0])

# 1 = Clicked, 0 = Not Clicked
y = np.array([0, 0, 1, 0, 1, 1, 1, 0, 1, 0])

# Combine features
X = np.column_stack((age, gender))

model = LogisticRegression()
model.fit(X, y)

predictions = model.predict(X)
predicted_probs = model.predict_proba(X)[:, 1]

print("Predictions:")
print(predictions)

print("\nProbabilities:")
print(predicted_probs)

print("\nPerson Results:")
for i in range(len(y)):
    print(f"Person {i+1}: Age={age[i]}, Gender={gender[i]}, "
          f"Actual={y[i]}, Predicted={predictions[i]}, "
          f"Probability_Click={predicted_probs[i]:.2f}")


accuracy = accuracy_score(y, predictions)
f1 = f1_score(y, predictions)
print("\nAccuracy:", accuracy)
print("F1 Score:", f1)


new_age = float(input("\nEnter age of new person: "))
new_gender = int(input("Enter gender (1 = Male, 0 = Female): "))
new_person = np.array([new_age, new_gender]).reshape(1, -1)


probability = model.predict_proba(new_person)
print("\nProbabilities [Not Click, Click] =", probability)

click_probability = probability[0][1]
if click_probability >= 0.5:
    prediction = "Person Will Click the Ad"
else:
    prediction = "Person Will Not Click the Ad"

print("\nHence Prediction for New Person:", prediction)
print("Probability of Clicking:", round(click_probability, 2))

plt.figure(figsize=(8, 5))

# Plot Not Clicked
plt.scatter(age[y == 0],predicted_probs[y == 0],color='blue',label='Not Clicked (0)',s=40)

# Plot Clicked
plt.scatter(age[y == 1],predicted_probs[y == 1],color='green',label='Clicked (1)',s=40)

# Decision boundary
plt.axhline(y=0.5,color='red',linestyle='--',label='Decision Boundary')

plt.xlabel("Age")
plt.ylabel("Probability of Clicking")
plt.title("Logistic Regression - Ad Click Prediction")

plt.legend()
plt.grid(True)
plt.show()