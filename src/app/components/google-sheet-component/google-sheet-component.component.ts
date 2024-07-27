import { Component, OnInit } from '@angular/core';
import { environment } from '../../../environments/environment';
import { NgFor, NgIf } from '@angular/common';

declare var gapi: any;

@Component({
  selector: 'app-google-sheet-component',
  standalone: true,
  imports: [NgFor, NgIf],
  templateUrl: './google-sheet-component.component.html',
  styleUrl: './google-sheet-component.component.css'
})
export class GoogleSheetComponentComponent implements OnInit {
  private apiKey: string = environment.googleApiKey;
  wordsDatabase: string[] = [];
  // Replace with your sheet's ID and range
  private SHEET_ID = '1N1QYo-YB2xawavxNuXFQxDZBgwTEjc_BR8yGvvQSj5s';
  private RANGE = 'Sheet1!A:F';

  // Use either API Key or Client ID and secret for OAuth
  private API_KEY = this.apiKey;
  // private CLIENT_ID = 'YOUR_CLIENT_ID';

  constructor() { }

  ngOnInit() {
    this.loadGapiClient();
  }

  loadGapiClient() {
    gapi.load('client', () => {
      gapi.client.init({
        apiKey: this.API_KEY,
        // clientId: this.CLIENT_ID, // Uncomment for OAuth
        discoveryDocs: ["https://sheets.googleapis.com/$discovery/rest?version=v4"],
        // scope: "https://www.googleapis.com/auth/spreadsheets.readonly" // Uncomment for OAuth
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
      const values = response.result.values;
      this.processData(values);
    }, (response: any) => {
      console.error('Error: ' + response.result.error.message);
    });
  }

  processData(values: string[][]) {
    // Clear the wordsDatabase array
    this.wordsDatabase = [];

    for (let i = 0; i < values.length; i++) {
      // Add the first column's word (Japanese) to the wordsDatabase
      if (values[i][0]) {
        this.wordsDatabase.push(values[i][0]);
      }
      // Add the second column's word (English) to the wordsDatabase
      if (values[i][1]) {
        this.wordsDatabase.push(values[i][1]);
      }
    }
  console.log(this.wordsDatabase)
  }
}