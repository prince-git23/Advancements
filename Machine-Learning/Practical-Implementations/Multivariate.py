import numpy as np
import matplotlib.pyplot as plt
from sklearn.linear_model import LinearRegression
from sklearn.metrics import r2_score, mean_squared_error

X = np.array([[6.1, 4.1],[6.15, 6],[6.3, 6.5],[7.24, 8],[7.5, 6.5],[7.5, 6.1],[7.9, 6.8],[8.0, 4.5],[8.9, 4.3],[9.2, 7],[9.5, 7],[9.5, 8.5],[9.52, 9],[9.6, 7]])
y = np.array([0.0,2.5,2.25,6.0,3.3,3.75,4.5,3.3,4.0,7.5,7.2,10.5,14.5,8.5])

model = LinearRegression()
model.fit(X, y)
y_pred = model.predict(X)

print("Intercept:", model.intercept_)
print("CGPA Coefficient:", model.coef_[0])
print("Communication Skill Coefficient:", model.coef_[1])

mse = mean_squared_error(y, y_pred)
r2 = r2_score(y, y_pred)
print("\nMean Squared Error:", mse)
print("R2 Score:", r2)

print("\nEnter details of the new student:")
cgpa = float(input("Enter CGPA (0-10): "))
communication = float(input("Enter Communication Skill (0-10): "))

new_student = np.array([[cgpa, communication]])
predicted_salary = model.predict(new_student)

print("\nPredicted Salary:", round(predicted_salary[0], 2), "Lakhs")

#Training Data
X_train = X[:-3]
y_train = y[:-3]

#Testing/Validation Data
X_test = X[-3:]
y_test = y[-3:]

plt.scatter(X_train[:, 0],y_train,color="blue",label="Training Data")
plt.scatter(X_test[:, 0],y_test,color="green",label="Testing Data (Last 3)")

cgpa_values = np.linspace(X[:, 0].min(),X[:, 0].max(),100)
communication_mean = X[:, 1].mean()

X_line = np.column_stack((cgpa_values,np.full(100, communication_mean)))
salary_line = model.predict(X_line)

plt.plot(cgpa_values,salary_line,color="red",label="Regression Line")

plt.xlabel("CGPA")
plt.ylabel("Salary (Lakhs)")
plt.title("Multivariate Linear Regression using OLS")

plt.legend()
plt.grid(True)
plt.show()