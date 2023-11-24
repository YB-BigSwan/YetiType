package com.yetitype.backend.domain;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

//Tell program that we are using the mongodb collection words
@Document(collection = "words")
public class Word {

	//Annotate mongodb ID
	@Id
	private String id;
	
	private String word;

	public Word(String id, String word) {
		super();
		this.id = id;
		this.word = word;
	}

	public String getId() {
		return id;
	}

	public void setId(String id) {
		this.id = id;
	}

	public String getWord() {
		return word;
	}

	public void setWord(String word) {
		this.word = word;
	}

}
