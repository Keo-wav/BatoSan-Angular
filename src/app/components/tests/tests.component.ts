import { NgFor, NgIf } from '@angular/common';
import { Component } from '@angular/core';

declare var gapi: any;

@Component({
  selector: 'app-tests',
  standalone: true,
  imports: [NgFor, NgIf],
  templateUrl: './tests.component.html',
  styleUrl: './tests.component.css'
})
export class TestsComponent {
  clicks:number = 0
  firstClickedWord: string | null = null // store the first clicked word
  firstClickedIndex: number | null = null
  secondClickedWord: string | null = null // store the second clicked word
  secondClickedIndex: number | null = null

  matchCount: number = 0
  twat: boolean = false

  wordsDatabase:string[] = []
  setOfTenWords:string[] = []
  shuffledEnglishWords:string[]= []
  shuffledJapaneseWords:string[] = []

  private API_KEY = 'AIzaSyBN4I-DWOMYHNQd6UDTfqd3i6YhjOCsfAg'
  private SHEET_ID = '1N1QYo-YB2xawavxNuXFQxDZBgwTEjc_BR8yGvvQSj5s';
  private RANGE = "'Dico'!A2:B";

  constructor() {
    this.shuffleWords()
  }
  
  ngOnInit() {
    this.loadGapiClient()
    this.shuffleWords()
  }

  loadGapiClient() {
    gapi.load('client', () => {
      gapi.client.init({
        apiKey: this.API_KEY,
        discoveryDocs: ["https://sheets.googleapis.com/$discovery/rest?version=v4"],
      }).then(() => {
        this.fetchData();
      }, (error: any) => {
        console.error("Error loading GAPI client for API", error);
      });
    });
  }

  fetchData() {
    gapi.client.sheets.spreadsheets.values.get({
      spreadsheetId: this.SHEET_ID,
      range: this.RANGE,
    }).then((response: any) => {
      // console.log('Response:', response);
      const values = response.result.values;
      this.processData(values);
      this.shuffleWords()
    }, (response: any) => {
      console.error('Error fetching data:', response.result.error);
    });
  }

  processData(values: string[][]) {
    this.wordsDatabase = [];
    for (let i = 0; i < values.length; i++) {
      if (values[i][0] && values[i][1]) {
        this.wordsDatabase.push(values[i][0], values[i][1]); // Add Japanese and English words as pairs
      }
    }
  
    this.shuffleWords(); 
  }

  only10Words(tab: string[]) {
    // take a random number that has to be even (english)
    let rand = 2 * Math.floor(Math.random() * (this.wordsDatabase.length / 2 + 1));
    tab.slice(rand, (rand + 10))
  }
  
  GetEnglishWords(wordsTab:string[]):string[] {
    let tab:string[] = []
    for (let i = 0; i < wordsTab.length ; i++) {
      if (i % 2 === 0) {
        tab.push(wordsTab[i])
      }
    }
    return tab
  }
  GetJapaneseWords(wordsTab:string[]):string[] {
    let tab:string[] = []
    for (let i = 0; i < wordsTab.length ; i++) {
      if (i % 2 !== 0) {
        tab.push(wordsTab[i])
      }
    }
    return tab
  }
  // SeparateWords(wordsTab:string[]):string[][] {
  //   let tab:string[][] = [[], []]
  //   for (let i = 0; i < wordsTab.length ; i++) {
  //     if (i % 2 === 0) {
  //       tab[0].push(wordsTab[i])
  //     } else if (i % 2 !== 0) {
  //       tab[1].push(wordsTab[i])
  //     }
  //   }
  //   return tab
  // }

  // Altered method to match check a pair of words in any order
  TranslatesTo(word1: string, word2: string): boolean {
    const index1 = this.wordsDatabase.indexOf(word1)
    const index2 = this.wordsDatabase.indexOf(word2)
    
    if (index1 === -1 || index2 === -1) {
      console.log(`${word1}/${word2}: no such word in database`)
      return false
    }
    
    // Check if word1 and word2 are correctly paired
    if (Math.abs(index1 - index2) === 1 // check if adjacent elems
    && Math.min(index1, index2) % 2 === 0) { // check if lower elem is even (= eng word)
      return true
    } else {
      return false
    }
  }

  HandleClick(word:string, index:number) {
    this.clicks += 1
    if (this.clicks % 2 !== 0) {
      this.firstClickedWord = word // hydrating the first click variable
      this.firstClickedIndex = index
      this.secondClickedWord = null; // clear previous second click
      this.secondClickedIndex = null;
      console.log('selected : ' + this.firstClickedWord)
    } else {
      this.secondClickedWord = word
      this.secondClickedIndex = index
      if (this.firstClickedWord) { // true if not null
        if (this.TranslatesTo(this.firstClickedWord, word)) {  // Check if pairs match
          this.matchCount += 1
          if (this.matchCount == 5) { 
            // 'Winning' alert after 5 successful words match 
            // BUT also works if same set of 2 words are matched 5 times in a row. 
            // TODO : ensure that the matched words are 5 strictly different sets of 2.
            window.alert('Félicitations pauvre con!')
          } else {
            console.log(`Match found: ${this.firstClickedWord} translates to ${this.secondClickedWord}`);
          }
        } else {
          console.log(`No match: ${this.firstClickedWord} does not translate to ${this.secondClickedWord}`);
          this.twat = true
        }
      }
      // no reset here because there would not be enough time to stylize clicked buttons
    }
  }

  // FOR TEST PURPOSE ONLY : matchCount reset function

  resetPage() { // or you know, you could just ... reload the page smh
    this.matchCount = 0
    this.shuffleWords()
    this.firstClickedWord = null
    this.firstClickedIndex = null
    this.secondClickedWord = null
    this.secondClickedIndex = null
  }

  // Display method to shuffle words

  shuffleArray(array: string[]): string[] {
    let shuffledArray = array.slice(); // Create a copy of the array
    for (let i = shuffledArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffledArray[i], shuffledArray[j]] = [shuffledArray[j], shuffledArray[i]]
    }
    return shuffledArray
  }

  shuffleWords() {
    // Separate words into English and Japanese
    const englishWords = this.GetEnglishWords(this.wordsDatabase);
    const japaneseWords = this.GetJapaneseWords(this.wordsDatabase);
  
    // Shuffle both arrays
    this.shuffledEnglishWords = this.shuffleArray(englishWords);
    this.shuffledJapaneseWords = this.shuffleArray(japaneseWords);
  
    // Adjust arrays to match in the template
    while (this.shuffledEnglishWords.length > 5) this.shuffledEnglishWords.pop();
    while (this.shuffledJapaneseWords.length > 5) this.shuffledJapaneseWords.pop();
  }


  // Dynamically styling clicked elements

  getButtonClass(index: number): string {
    if (index === this.firstClickedIndex || index === this.secondClickedIndex) {
      if (this.firstClickedIndex !== null && this.secondClickedIndex !== null) {
        return this.TranslatesTo(this.firstClickedWord!, this.secondClickedWord!) ? 'has-background-success' : 'has-background-danger';
      }
      return 'has-background-info'
    }
    return ''
  }
}
