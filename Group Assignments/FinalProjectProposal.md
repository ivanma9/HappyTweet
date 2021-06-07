## Group Repository

https://github.com/ivanma9/HappyTweet

## Introduction:

Our group name is “Happy Tweet” and our project looks at social media usage (specifically Twitter usage) and happiness levels across cities in the United States. Knowing that social media plays such a central role in today’s society, we are trying to see how people express emotions on social media and how the content of tweets correlates to happiness levels.

## Team Members:

### MJ Howland - Content Creator

<img src = "img/MJ.png">

I am a third-year sociology student minoring in digital humanities and art history. In my free time I serve as the co-captain of the UCLA Sailing Team. When I graduate, I am interested in pursuing a career in digital marketing and brand strategy.
For this project, I will be overseeing the writing and design process. I will be the one writing up anything for the website, including introductions, background information, research, etc. As for helping with the design, the plan is to draft ideas in Figma, a designing platform, so that Ivan can go in and utilize the actual code for my designs.

### Ivan Ma - Web Developer

<img src = "img/Ivan.png">

I am a third-year/first year transfer computer science student. I love to play soccer on a competitive level and munch on all sorts of food.
I will be conducting most of the coding for this project. Piecing together our creative ideas into a web application that integrates thick mapping is a goal that I want to contribute for our project. I hope to collaborate with my group mates in Figma and keep and maintain good user design and experience for the interactivity of our site.

### Josephine Meyer-Hogan - Team Leader

<img src = "img/Josephine.png">

## Overview:

Our group wanted to dig deeper into the realm of social media for this project. From research, we have learned that social media is such a dominant force in society used by many. We have also learned that there may be reason to think that increased social media usage might have negative consequences on personal and mental health. For these reasons, we wanted to explore the relationship between social media and emotions/mental health. 
We have chosen two datasets, one from Wallethub.com that includes happiness scores calculated for specific cities in the U.S., and one that we have created ourselves using Twarc. We used Twarc to scrape tweets from the top 31 happiest cities recorded by Wallethub that represented different emotional or happiness levels. For higher happiness levels, we scraped all tweets with the words “happy” and “love,” for neutral levels we scraped all tweets with the words “okay” and “alright,” and for lower levels we scraped all tweets with the words “sad” and “hate.” We are interested in seeing the distribution of each set of tweets within each city and comparing this to the happiness score given for each city. We want to see if there is any correlation between the happiness score and the contents of tweets being tweeted by users in that city, to see if there can be a connection made between social media and happiness.

## Methodology:

Web mapping is a very diverse method of communicating often used to tell stories, answer questions, and represent data. A map is able to portray information in a way that more traditional data graphics cannot. The perspective that comes with viewing data geographically is very unique and discovering correlations in the data becomes much easier. There is also often data that needs to be analyzed with the location in mind, as in our case. In our investigation, we are looking for a correlation between happiness and social media use in the US. This data utilizes geolocation as the foundation for data collection. Location provides a common ground that allows us to analyze and compare multiple data sets in order to find similarities.

## Workflow:

| Week   | Phase                                    | Tasks To Complete                                                                                                                             |
| ------ | ---------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------- |
| 2      | Brainstorming                            | Group project proposal                                                                                                                        |
| 3      | Research                                 | <ul> <li> Do background research on our topic so that we can include relevant information on the website </li></ul>                           |
| 4      | Prep                                     | <ul><li> Data cleaning / refining</li><li> Finalizing the objectives we want to accomplish / what we want the end product to include</li><ul> |
| 5      | Starting to Code + Design                | <ul> <li> Start coding website </li><li> Start coding maps</li> <li> Start working in figma to create design </li></ul>                       |
| 6      | Continue Coding + Design                 | Continue Above                                                                                                                                |
| 7      | Continue Coding + Design + Start Writing | <ul> <li>Continue Above </li><li> Start drafting writing for the website and scraping Twitter data in Twarc. </li></ul>                                                           |
| 8      | Continue Coding + Design + Writing       | Continue Above                                                                                                                                |
| 9      | Start to finalize                        | Start making edits and making sure all site pages have their proper content                                                                   |
| 10     | Continue finalizing                      | By now we should have the website pretty much completed and just making last minute edits                                                     |
| Finals | Final                                    | Present to the class                                                                                                                          |

## Technical Scope:

We will be using Git for our repository for easy collaboration. Leaflet library will be used for our mapping alongside Javascript to pair with it. HTML will be used for adding elements to the website in an organized fashion. Bootstrap and CSS will be used for styling and design. We will use Twarc to collect Twitter data.

## Data:

We will be using two datasets and producing three maps in total for this project.
Dataset #1: https://wallethub.com/edu/happiest-places-to-live/32619
Dataset #2: https://github.com/ivanma9/HappyTweet/blob/main/data/happiness_cities.csv
The first dataset shows happiness scores and indexes across different cities in the United States. It was compiled using various already existing reports with measures reflective of the following three categories: (1) emotion and physical well-being, (2) income and employment, and (3) community and environment. Example measures include happiness/depression indexes and suicide rates, poverty rates and income information, and hate-crime data, respectively. The dates of data used range from 2010 to 2014. 
As mentioned before, the second dataset is one that we created on our own using Twarc. We scraped twitter data for tweets in the 30 happiest cities recorded in the above dataset for tweets with the words “happy” and “love,” “okay” and “alright,” and “sad” and “hate.” We then counted the number of times each city had tweets with these key terms in them. 
