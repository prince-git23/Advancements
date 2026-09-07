import matplotlib.pyplot as plt
from numpy import array,zeros
from statistics import mean
from sklearn.metrics import r2_score

cgpa = array([
    6.42, 7.18, 8.35, 6.87,
    9.12, 7.64, 8.91, 6.55,
    9.48, 7.03, 8.27, 9.76, 7.82
])

salary = array([
    3.20, 5.10, 7.80, 4.25,
    11.50, 6.40, 9.30, 3.75,
    13.20, 5.60, 8.15, 15.40, 7.25
])

avg_cgpa,avg_salary = mean(cgpa),mean(salary)
num,deno = 0,0

for i in range(len(cgpa)):
    num+=(cgpa[i]-avg_cgpa) * (salary[i]-avg_salary)
    deno+=(cgpa[i]-avg_cgpa)**2

slope = num/deno
y_intercept = avg_salary - slope * avg_cgpa

print("Equation of thes best fir line is")
print(f"y ={slope:.2f}*x + {y_intercept:.2f}")

predicted_salary = zeros((len(cgpa),1))

for i in range(len(cgpa)):
    predicted_salary[i] = slope * cgpa[i] + y_intercept

score_r2 = round(r2_score(salary,predicted_salary),2)
print("R2 score:",score_r2)

plt.scatter(cgpa,salary,color='blue')

plt.xlabel("CGPA")
plt.ylabel("Salary")
plt.title(f"Linear Ordinary LS fit Model - R2 Score = {score_r2}") 

plt.plot([5.5,10.0],slope*array([5.5,10.0])+y_intercept,'red')
predictor_cgpa = array([7.11,7.34,8.58,9.17,8.34])
response_salary = slope*predictor_cgpa+y_intercept

for i in range(len(predictor_cgpa)):
    response_salary[i] if response_salary[i]>0 else 0
    plt.plot(predictor_cgpa[i],response_salary[i],'gs')
    print(f"Predicted Salary for the Student {i+1} with CGPA " f"{predictor_cgpa[i]} is Rs {response_salary[i]:.2f} Lac" )

plt.show()