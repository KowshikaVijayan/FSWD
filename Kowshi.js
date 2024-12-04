Here's how you can create an **Android application in Java** to simulate an online examination system. This app will handle multiple-choice questions (MCQs) and fill-in-the-blanks questions, store answers in a database, and display the results after submission.

---

### **Application Features**
1. **Login Screen** for authentication.
2. **Exam Interface** with:
   - Multiple-choice questions (MCQs).
   - Fill-in-the-blank questions.
3. **Backend** to store questions, user responses, and evaluate results.
4. **Result Screen** to display marks.

---

### **Step-by-Step Implementation**

#### **1. Dependencies**
Add the following dependencies to your `build.gradle` file:
```gradle
dependencies {
    implementation 'com.google.firebase:firebase-auth:21.5.0'
    implementation 'com.google.firebase:firebase-database:20.4.1'
    implementation 'androidx.recyclerview:recyclerview:1.3.1'
    implementation 'com.google.android.material:material:1.9.0'
}
```

---

#### **2. Database Structure**
Use **Firebase Realtime Database** for storing questions and answers. Example structure:
```json
{
  "questions": {
    "1": { "type": "mcq", "question": "What is 2 + 2?", "options": ["3", "4", "5"], "answer": "4" },
    "2": { "type": "fill", "question": "The capital of France is ___", "answer": "Paris" }
  },
  "responses": {
    "user1": { "1": "4", "2": "Paris" }
  }
}
```

---

#### **3. Login Activity**

`res/layout/activity_login.xml`:
```xml
<LinearLayout xmlns:android="http://schemas.android.com/apk/res/android"
    android:layout_width="match_parent"
    android:layout_height="match_parent"
    android:orientation="vertical"
    android:padding="16dp">

    <EditText
        android:id="@+id/emailInput"
        android:layout_width="match_parent"
        android:layout_height="wrap_content"
        android:hint="Email"
        android:inputType="textEmailAddress" />

    <EditText
        android:id="@+id/passwordInput"
        android:layout_width="match_parent"
        android:layout_height="wrap_content"
        android:hint="Password"
        android:inputType="textPassword" />

    <Button
        android:id="@+id/loginButton"
        android:layout_width="match_parent"
        android:layout_height="wrap_content"
        android:text="Login" />
</LinearLayout>
```

`LoginActivity.java`:
```java
public class LoginActivity extends AppCompatActivity {
    private FirebaseAuth auth;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_login);

        auth = FirebaseAuth.getInstance();

        EditText emailInput = findViewById(R.id.emailInput);
        EditText passwordInput = findViewById(R.id.passwordInput);
        Button loginButton = findViewById(R.id.loginButton);

        loginButton.setOnClickListener(v -> {
            String email = emailInput.getText().toString();
            String password = passwordInput.getText().toString();

            auth.signInWithEmailAndPassword(email, password).addOnCompleteListener(task -> {
                if (task.isSuccessful()) {
                    startActivity(new Intent(this, ExamActivity.class));
                    finish();
                } else {
                    Toast.makeText(this, "Login Failed!", Toast.LENGTH_SHORT).show();
                }
            });
        });
    }
}
```

---

#### **4. Exam Activity**

`ExamActivity.java`:
```java
public class ExamActivity extends AppCompatActivity {
    private DatabaseReference database;
    private List<Question> questions;
    private Map<String, String> responses = new HashMap<>();
    private int currentQuestionIndex = 0;

    private TextView questionText;
    private RadioGroup optionsGroup;
    private EditText fillAnswerInput;
    private Button nextButton;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_exam);

        questionText = findViewById(R.id.questionText);
        optionsGroup = findViewById(R.id.optionsGroup);
        fillAnswerInput = findViewById(R.id.fillAnswerInput);
        nextButton = findViewById(R.id.nextButton);

        database = FirebaseDatabase.getInstance().getReference();
        questions = new ArrayList<>();

        loadQuestions();

        nextButton.setOnClickListener(v -> {
            saveResponse();
            currentQuestionIndex++;
            if (currentQuestionIndex < questions.size()) {
                displayQuestion();
            } else {
                submitResponses();
            }
        });
    }

    private void loadQuestions() {
        database.child("questions").get().addOnCompleteListener(task -> {
            if (task.isSuccessful()) {
                for (DataSnapshot snapshot : task.getResult().getChildren()) {
                    Question question = snapshot.getValue(Question.class);
                    questions.add(question);
                }
                displayQuestion();
            }
        });
    }

    private void displayQuestion() {
        Question currentQuestion = questions.get(currentQuestionIndex);
        questionText.setText(currentQuestion.getQuestion());
        optionsGroup.removeAllViews();
        fillAnswerInput.setVisibility(View.GONE);

        if ("mcq".equals(currentQuestion.getType())) {
            for (String option : currentQuestion.getOptions()) {
                RadioButton radioButton = new RadioButton(this);
                radioButton.setText(option);
                optionsGroup.addView(radioButton);
            }
        } else if ("fill".equals(currentQuestion.getType())) {
            fillAnswerInput.setVisibility(View.VISIBLE);
        }
    }

    private void saveResponse() {
        Question currentQuestion = questions.get(currentQuestionIndex);
        if ("mcq".equals(currentQuestion.getType())) {
            int selectedId = optionsGroup.getCheckedRadioButtonId();
            if (selectedId != -1) {
                RadioButton selectedOption = findViewById(selectedId);
                responses.put(currentQuestion.getId(), selectedOption.getText().toString());
            }
        } else if ("fill".equals(currentQuestion.getType())) {
            String answer = fillAnswerInput.getText().toString();
            responses.put(currentQuestion.getId(), answer);
        }
    }

    private void submitResponses() {
        String userId = FirebaseAuth.getInstance().getCurrentUser().getUid();
        database.child("responses").child(userId).setValue(responses).addOnCompleteListener(task -> {
            if (task.isSuccessful()) {
                calculateScore();
            }
        });
    }

    private void calculateScore() {
        int score = 0;
        for (Question question : questions) {
            String correctAnswer = question.getAnswer();
            String userAnswer = responses.get(question.getId());
            if (correctAnswer != null && correctAnswer.equalsIgnoreCase(userAnswer)) {
                score++;
            }
        }
        Intent intent = new Intent(this, ResultActivity.class);
        intent.putExtra("score", score);
        startActivity(intent);
        finish();
    }
}
```

---

#### **5. Result Activity**

`ResultActivity.java`:
```java
public class ResultActivity extends AppCompatActivity {
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_result);

        int score = getIntent().getIntExtra("score", 0);
        TextView scoreText = findViewById(R.id.scoreText);
        scoreText.setText("Your Score: " + score);
    }
}
```

---

### **Final Touches**
1. **Database Initialization**: Populate Firebase with questions in the specified structure.
2. **UI Enhancements**: Use Material Design for better visuals.
3. **Testing**: Test the app thoroughly on different devices.

Let me know if you need additional features or guidance!
