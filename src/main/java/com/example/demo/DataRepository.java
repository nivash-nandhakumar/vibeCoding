
package com.example.demo;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface DataRepository extends JpaRepository<Data, Long> {

    List<Data> findByUsername(String username);
}
