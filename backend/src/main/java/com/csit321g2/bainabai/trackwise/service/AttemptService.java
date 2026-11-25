package com.csit321g2.bainabai.trackwise.service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.NoSuchElementException;
import java.util.Set;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.csit321g2.bainabai.trackwise.entity.AnswerEntity;
import com.csit321g2.bainabai.trackwise.entity.AttemptEntity;
import com.csit321g2.bainabai.trackwise.entity.ChoiceEntity;
import com.csit321g2.bainabai.trackwise.entity.QuestionEntity;
import com.csit321g2.bainabai.trackwise.entity.QuizEntity;
import com.csit321g2.bainabai.trackwise.entity.Role;
import com.csit321g2.bainabai.trackwise.entity.UserEntity;
import com.csit321g2.bainabai.trackwise.repository.AnswerRepository;
import com.csit321g2.bainabai.trackwise.repository.AttemptRepository;
import com.csit321g2.bainabai.trackwise.repository.ChoiceRepository;
import com.csit321g2.bainabai.trackwise.repository.QuestionRepository;
import com.csit321g2.bainabai.trackwise.repository.QuizRepository;
import com.csit321g2.bainabai.trackwise.repository.UserRepository;

@Service
public class AttemptService {

    @Autowired
    AttemptRepository repo;

    @Autowired
    AnswerRepository answerRepo;

    @Autowired
    QuizRepository quizRepo;

    @Autowired
    UserRepository userRepo;

    @Autowired
    QuestionRepository questionRepo;

    @Autowired
    ChoiceRepository choiceRepo;

    public AttemptService() {
    }

    @Transactional
    public AttemptEntity submitAttempt(AttemptEntity attempt) {
        if (attempt.getQuiz() == null) {
            throw new IllegalArgumentException("Quiz is required!");
        }
        int quizId = attempt.getQuiz().getQuizId();
        QuizEntity quiz = quizRepo.findById(quizId).orElseThrow(() -> new NoSuchElementException("Quiz " + quizId + " does not exist!"));
        if (attempt.getStudent() == null) {
            throw new IllegalArgumentException("Student is required!");
        }
        int studentId = attempt.getStudent().getUserId();
        UserEntity student = userRepo.findById(studentId).orElseThrow(() -> new NoSuchElementException("User " + studentId + " does not exist!"));
        if (student.getRole() != Role.STUDENT) {
            throw new IllegalArgumentException("User " + studentId + " is not a student!");
        }

        Map<Integer, ChoiceEntity> quizChoices = new HashMap<>();
        Map<Integer, List<ChoiceEntity>> choicesByQuestion = new HashMap<>();
        for (ChoiceEntity choice : choiceRepo.findByQuestionQuizQuizIdOrderByChoiceIdAsc(quizId)) {
            quizChoices.put(choice.getChoiceId(), choice);
            choicesByQuestion.computeIfAbsent(choice.getQuestion().getQuestionId(), id -> new ArrayList<>()).add(choice);
        }
        List<QuestionEntity> quizQuestions = questionRepo.findByQuizQuizIdOrderByQuestionIdAsc(quizId);
        Set<Integer> quizQuestionIds = quizQuestions.stream().map(QuestionEntity::getQuestionId).collect(Collectors.toSet());
        List<QuestionEntity> gradedQuestions = quizQuestions.stream()
                .filter(question -> choicesByQuestion.containsKey(question.getQuestionId()))
                .toList();
        if (gradedQuestions.isEmpty()) {
            throw new IllegalArgumentException("Quiz " + quizId + " has no questions to answer!");
        }

        Map<Integer, ChoiceEntity> chosen = new HashMap<>();
        Set<Integer> answered = new HashSet<>();
        List<AnswerEntity> submitted = attempt.getAnswers() == null ? List.of() : attempt.getAnswers();
        for (AnswerEntity answer : submitted) {
            if (answer == null || answer.getQuestion() == null) {
                throw new IllegalArgumentException("Question is required!");
            }
            int questionId = answer.getQuestion().getQuestionId();
            if (!quizQuestionIds.contains(questionId)) {
                if (!questionRepo.existsById(questionId)) {
                    throw new NoSuchElementException("Question " + questionId + " does not exist!");
                }
                throw new IllegalArgumentException("Question " + questionId + " is not in quiz " + quizId + "!");
            }
            if (!answered.add(questionId)) {
                throw new IllegalArgumentException("Question " + questionId + " is answered more than once!");
            }
            if (answer.getChoice() == null) {
                continue;
            }
            int choiceId = answer.getChoice().getChoiceId();
            ChoiceEntity choice = quizChoices.get(choiceId);
            if (choice == null && !choiceRepo.existsById(choiceId)) {
                throw new NoSuchElementException("Choice " + choiceId + " does not exist!");
            }
            if (choice == null || choice.getQuestion().getQuestionId() != questionId) {
                throw new IllegalArgumentException("Choice " + choiceId + " is not an option for question " + questionId + "!");
            }
            chosen.put(questionId, choice);
        }

        LocalDateTime submittedAt = LocalDateTime.now();
        LocalDateTime startedAt = attempt.getStartedAt();
        if (startedAt == null || startedAt.isAfter(submittedAt)) {
            startedAt = submittedAt;
        }

        AttemptEntity graded = new AttemptEntity(quiz, student, startedAt, submittedAt);
        List<AnswerEntity> answers = new ArrayList<>();
        int score = 0;
        for (QuestionEntity question : gradedQuestions) {
            ChoiceEntity choice = chosen.get(question.getQuestionId());
            boolean correct = choice != null && choice.getIsCorrect();
            if (correct) {
                score++;
            }
            answers.add(new AnswerEntity(graded, question, choice, correct));
        }
        graded.setScore(score);

        AttemptEntity saved = repo.save(graded);
        List<AnswerEntity> savedAnswers = answerRepo.saveAll(answers);
        setCorrectChoices(savedAnswers);
        saved.setAnswers(savedAnswers);
        return saved;
    }

    public AttemptEntity getAttempt(int id) {
        AttemptEntity attempt = repo.findById(id).orElseThrow(() -> new NoSuchElementException("Attempt " + id + " does not exist!"));
        List<AnswerEntity> answers = answerRepo.findByAttemptAttemptIdOrderByAnswerIdAsc(id);
        setCorrectChoices(answers);
        attempt.setAnswers(answers);
        return attempt;
    }

    public List<AttemptEntity> getAttemptsByStudent(int studentId) {
        if (!userRepo.existsById(studentId)) {
            throw new NoSuchElementException("User " + studentId + " does not exist!");
        }
        List<AttemptEntity> attempts = repo.findByStudentUserIdOrderBySubmittedAtDescAttemptIdDesc(studentId);
        List<AnswerEntity> answers = answerRepo.findByAttemptStudentUserIdOrderByAnswerIdAsc(studentId);
        setCorrectChoices(answers);
        Map<Integer, List<AnswerEntity>> answersByAttempt = answers.stream()
                .collect(Collectors.groupingBy(answer -> answer.getAttempt().getAttemptId()));
        for (AttemptEntity attempt : attempts) {
            attempt.setAnswers(answersByAttempt.getOrDefault(attempt.getAttemptId(), new ArrayList<>()));
        }
        return attempts;
    }

    private void setCorrectChoices(List<AnswerEntity> answers) {
        if (answers.isEmpty()) {
            return;
        }
        Set<Integer> questionIds = answers.stream().map(answer -> answer.getQuestion().getQuestionId()).collect(Collectors.toSet());
        Map<Integer, ChoiceEntity> correctByQuestion = new HashMap<>();
        for (ChoiceEntity choice : choiceRepo.findByQuestionQuestionIdInOrderByChoiceIdAsc(questionIds)) {
            if (choice.getIsCorrect()) {
                correctByQuestion.putIfAbsent(choice.getQuestion().getQuestionId(), choice);
            }
        }
        for (AnswerEntity answer : answers) {
            answer.setCorrectChoice(correctByQuestion.get(answer.getQuestion().getQuestionId()));
        }
    }

}
