package com.yetitype.backend.domain;


import java.util.List;

import org.springframework.data.mongodb.repository.MongoRepository;

public interface WordRepository extends MongoRepository<Word, String>{
	List<Word> findWordById(String id);
}
