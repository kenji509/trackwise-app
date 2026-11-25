package com.csit321g2.bainabai.trackwise.entity;

import jakarta.persistence.*;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;

@Entity
@Table(name = "answer")
public class AnswerEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int answerId;

    @JsonIgnore
    @ManyToOne(optional = false)
    @OnDelete(action = OnDeleteAction.CASCADE)
    @JoinColumn(name = "attempt_id", nullable = false)
    private AttemptEntity attempt;

    @JsonIgnoreProperties({ "quiz" })
    @ManyToOne(optional = false)
    @OnDelete(action = OnDeleteAction.CASCADE)
    @JoinColumn(name = "question_id", nullable = false)
    private QuestionEntity question;

    @JsonIgnoreProperties({ "question" })
    @ManyToOne
    @OnDelete(action = OnDeleteAction.SET_NULL)
    @JoinColumn(name = "choice_id")
    private ChoiceEntity choice;

    @JsonProperty(access = JsonProperty.Access.READ_ONLY)
    @Column(nullable = false)
    private boolean correct;

    @Transient
    @JsonProperty(access = JsonProperty.Access.READ_ONLY)
    @JsonIgnoreProperties({ "question" })
    private ChoiceEntity correctChoice;

    public AnswerEntity() {
    }

    public AnswerEntity(AttemptEntity attempt, QuestionEntity question, ChoiceEntity choice, boolean correct) {
        this.attempt = attempt;
        this.question = question;
        this.choice = choice;
        this.correct = correct;
    }

    public int getAnswerId() {
        return answerId;
    }

    public AttemptEntity getAttempt() {
        return attempt;
    }

    public void setAttempt(AttemptEntity attempt) {
        this.attempt = attempt;
    }

    public QuestionEntity getQuestion() {
        return question;
    }

    public void setQuestion(QuestionEntity question) {
        this.question = question;
    }

    public ChoiceEntity getChoice() {
        return choice;
    }

    public void setChoice(ChoiceEntity choice) {
        this.choice = choice;
    }

    public boolean getCorrect() {
        return correct;
    }

    public void setCorrect(boolean correct) {
        this.correct = correct;
    }

    public ChoiceEntity getCorrectChoice() {
        return correctChoice;
    }

    public void setCorrectChoice(ChoiceEntity correctChoice) {
        this.correctChoice = correctChoice;
    }
}
