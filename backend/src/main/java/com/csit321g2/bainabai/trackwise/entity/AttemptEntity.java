package com.csit321g2.bainabai.trackwise.entity;

import java.time.LocalDateTime;
import java.util.List;

import jakarta.persistence.*;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;
import com.fasterxml.jackson.annotation.JsonProperty;

@Entity
@Table(name = "attempt")
public class AttemptEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int attemptId;

    @ManyToOne(optional = false)
    @OnDelete(action = OnDeleteAction.CASCADE)
    @JoinColumn(name = "quiz_id", nullable = false)
    private QuizEntity quiz;

    @ManyToOne(optional = false)
    @OnDelete(action = OnDeleteAction.CASCADE)
    @JoinColumn(name = "student_id", nullable = false)
    private UserEntity student;

    @Column(nullable = false, updatable = false)
    private LocalDateTime startedAt;

    @JsonProperty(access = JsonProperty.Access.READ_ONLY)
    @Column(nullable = false, updatable = false)
    private LocalDateTime submittedAt;

    @JsonProperty(access = JsonProperty.Access.READ_ONLY)
    @Column(nullable = false)
    private int score;

    @Transient
    private List<AnswerEntity> answers;

    public AttemptEntity() {
    }

    public AttemptEntity(QuizEntity quiz, UserEntity student, LocalDateTime startedAt, LocalDateTime submittedAt) {
        this.quiz = quiz;
        this.student = student;
        this.startedAt = startedAt;
        this.submittedAt = submittedAt;
    }

    public int getAttemptId() {
        return attemptId;
    }

    public QuizEntity getQuiz() {
        return quiz;
    }

    public void setQuiz(QuizEntity quiz) {
        this.quiz = quiz;
    }

    public UserEntity getStudent() {
        return student;
    }

    public void setStudent(UserEntity student) {
        this.student = student;
    }

    public LocalDateTime getStartedAt() {
        return startedAt;
    }

    public void setStartedAt(LocalDateTime startedAt) {
        this.startedAt = startedAt;
    }

    public LocalDateTime getSubmittedAt() {
        return submittedAt;
    }

    public void setSubmittedAt(LocalDateTime submittedAt) {
        this.submittedAt = submittedAt;
    }

    public int getScore() {
        return score;
    }

    public void setScore(int score) {
        this.score = score;
    }

    public List<AnswerEntity> getAnswers() {
        return answers;
    }

    public void setAnswers(List<AnswerEntity> answers) {
        this.answers = answers;
    }
}
