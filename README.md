# Confides: A Visual Analytics Solution for Automated Speech Recognition Analysis and Exploration
<b>Sunwoo Ha, Chaehun Lim, R. Jordan Crouser, and Alvitta Ottley</b>

This repository contains the implementation of <b>Confides</b>, a visual analytic tool designed with intelligence analysts that allows analysts to easily transcribe their audio files and explore the transcription while being aware of uncertainties within the data. This work was accepted as a short paper in IEEE VIS 2024. 

## Abstract
Confidence scores of automatic speech recognition (ASR) outputs are often inadequately communicated, preventing its seamless integration into analytical workflows. In this paper, we introduce <b>Confides</b>, a visual analytic system developed in collaboration with intelligence analysts to address this issue. Confides aims to aid exploration and post-AI-transcription editing by visually representing the confidence associated with the transcription. We demonstrate how our tool can assist intelligence analysts who use ASR outputs in their analytical and exploratory tasks and how it can help mitigate misinterpretation of crucial information. We also discuss opportunities for improving textual data cleaning and model transparency for human-machine collaboration.

## Directory Overview
The following provides an overview of the directories in this repository.

### frontend
This directory contains the (React) frontend of our application.

### api
This directory contains the (Python Flask) backend of our web application.

## Running on your computer
To run this on your computer, you must install' yarn'. You then need to go into the `frontend` folder and run the following commands: 

1. `yarn install` to install all packages needed (not needed if you have already installed all necessary packages)
2. `yarn start` to start the frontend
3. `yarn start-api` to start the backend
