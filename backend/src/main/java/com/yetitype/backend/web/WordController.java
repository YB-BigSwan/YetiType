package com.yetitype.backend.web;

import java.util.ArrayList;
import java.util.List;
import java.util.Random;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import com.yetitype.backend.domain.Word;
import com.yetitype.backend.domain.WordRepository;

@Controller
public class WordController {

	@Autowired
	private WordRepository wordRepository;

	// remove if deploying(disables CORS for port 3000 for local testing)
	@CrossOrigin(origins = "http://localhost:3000")
	@GetMapping("/api/wordlist")
	public @ResponseBody List<Word> wordListRest() {
		//getting all words from collection
		List<Word> allWords = wordRepository.findAll();
		//selecting 80 random words
		List<Word> randomWords = getRandomWords(allWords, 80);
		return randomWords;
	}
	
	
	//Function to select random words
	private List<Word> getRandomWords(List<Word> allWords, int numberOfWords) {
		if (allWords.size() <= numberOfWords) {
			return allWords;
		} else {
			List<Word> randomWords = new ArrayList<>();
			Random random = new Random();
			while (randomWords.size() < numberOfWords) {
				int randomIndex = random.nextInt(allWords.size());
				Word randomWord = allWords.get(randomIndex);
				if (!randomWords.contains(randomWord)) {
					randomWords.add(randomWord);
				}
			}
			return randomWords;
		}
	}

}
