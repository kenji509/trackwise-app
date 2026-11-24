package com.csit321g2.bainabai.trackwise.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.csit321g2.bainabai.trackwise.entity.QuestionEntity;

@Repository
public interface QuestionRepository extends JpaRepository<QuestionEntity, Integer> {

    List<QuestionEntity> findByQuizQuizIdOrderByQuestionIdAsc(int quizId);
}
