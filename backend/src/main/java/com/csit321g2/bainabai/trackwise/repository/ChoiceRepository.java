package com.csit321g2.bainabai.trackwise.repository;

import java.util.Collection;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.csit321g2.bainabai.trackwise.entity.ChoiceEntity;

@Repository
public interface ChoiceRepository extends JpaRepository<ChoiceEntity, Integer> {

    List<ChoiceEntity> findByQuestionQuizQuizIdOrderByChoiceIdAsc(int quizId);

    List<ChoiceEntity> findByQuestionQuestionIdInOrderByChoiceIdAsc(Collection<Integer> questionIds);
}
