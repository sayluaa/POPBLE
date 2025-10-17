package com.popble.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.popble.domain.MapApi;

@Repository
public interface MapApiRepository extends JpaRepository<MapApi, Long>{

}
