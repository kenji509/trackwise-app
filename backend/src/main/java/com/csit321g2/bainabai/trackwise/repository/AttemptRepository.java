package com.csit321g2.bainabai.trackwise.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.csit321g2.bainabai.trackwise.entity.AttemptEntity;

@Repository
public interface AttemptRepository extends JpaRepository<AttemptEntity, Integer> {

    List<AttemptEntity> findByStudentUserIdOrderBySubmittedAtDescAttemptIdDesc(int studentId);
}
