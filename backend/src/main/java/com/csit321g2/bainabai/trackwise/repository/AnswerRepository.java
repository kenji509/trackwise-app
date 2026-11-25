package com.csit321g2.bainabai.trackwise.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.csit321g2.bainabai.trackwise.entity.AnswerEntity;

@Repository
public interface AnswerRepository extends JpaRepository<AnswerEntity, Integer> {

    List<AnswerEntity> findByAttemptAttemptIdOrderByAnswerIdAsc(int attemptId);

    List<AnswerEntity> findByAttemptStudentUserIdOrderByAnswerIdAsc(int studentId);
}
