import { Typography, Stack, Button, TextField } from "@mui/material";
import { Accordion, AccordionDetails, AccordionSummary } from "@mui/material";

import { DataGrid } from "@mui/x-data-grid";
import React, { useState, useEffect } from "react";
import HomeIcon from "@mui/icons-material/Home";
import SearchIcon from "@mui/icons-material/Search";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";

import Login from "./Login";

const FindFriends = (props) => {
  const [interestResults, setInterestResults] = useState([]);
  const [friendResults, setFriendResults] = useState([]);
  const [expandedInterest, setExpandedInterest] = useState(false);
  const [expandedFriends, setExpandedFriends] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);
  const [numFriends, setNumFriends] = useState("");

  const MAJORS = [
    "Accountancy",
    "Accountancy + Data Science",
    "ACES Undeclared",
    "Acting",
    "Actuarial Science",
    "Advertising",
    "Aerospace Engineering",
    "African American Studies",
    "Agri-Accounting",
    "Agribusiness, Markets & Management",
    "Agricultural and Biological Engineering (ACES)",
    "Agricultural and Biological Engineering (ENG)",
    "Agricultural and Consumer Economics",
    "Agricultural Communications",
    "Agricultural Education",
    "Agricultural Leadership, Education, and Communications",
    "Agronomy",
    "Animal Sciences",
    "Anthropology",
    "Architectural Studies",
    "Art and Art History ",
    "Art Education (K-12)",
    "Art Undeclared ",
    "Arts and Entertainment Technology ",
    "Asian American Studies",
    "Astronomy",
    "Astronomy + Data Science",
    "Astrophysics",
    "Atmospheric Sciences",
    "Biochemistry",
    "Bioengineering",
    "Biology",
    "Brain and Cognitive Science",
    "Business Undeclared",
    "Chemical Engineering",
    "Chemistry",
    "Civil Engineering",
    "Classics",
    "Communication",
    "Community Health",
    "Comparative and World Literature",
    "Computer Engineering",
    "Computer Science",
    "Computer Science and Advertising",
    "Computer Science and Animal Sciences",
    "Computer Science and Anthropology",
    "Computer Science and Astronomy",
    "Computer Science and Chemistry",
    "Computer Science and Crop Sciences",
    "Computer Science and Economics ",
    "Computer Science and Education, Learning Sciences",
    "Computer Science and Education, Secondary Education",
    "Computer Science and Geography & Geographic Information Science",
    "Computer Science and Linguistics",
    "Computer Science and Music",
    "Computer Science and Philosophy",
    "Consumer Economics & Finance",
    "Costume Design and Technology",
    "Creative Writing",
    "Crop Sciences",
    "Dance (BA)",
    "Dance (BFA)",
    "Dance, BA and Kinesiology, BS (Dual Degree Program)",
    "Dietetics",
    "Early Childhood Education (Birth-Grade 2)",
    "Earth, Society, and Environmental Sustainability",
    "East Asian Languages and Cultures",
    "Econometrics and Quantitative Economics",
    "Economics",
    "Electrical Engineering",
    "Elementary Education (Grades 1-6)",
    "Engineering Mechanics",
    "Engineering Technology and Management for Agricultural Systems",
    "Engineering Undeclared",
    "English",
    "Environmental Economics & Policy",
    "Farm Management",
    "Finance",
    "Finance + Data Science",
    "Finance in Agri-Business",
    "Financial Planning",
    "Food Science",
    "Food Science & Human Nutrition",
    "French",
    "Gender and Women's Studies",
    "Geography and Geographic Information Science",
    "Geology",
    "Germanic Studies",
    "Global Studies",
    "Graphic Design",
    "Health Sciences, Interdisciplinary ",
    "History",
    "History of Art",
    "Hospitality Management",
    "Human Development and Family Studies",
    "Human Nutrition",
    "Industrial Design",
    "Industrial Engineering",
    "Information Sciences",
    "Information Sciences + Data Science",
    "Information Systems",
    "Integrative Biology",
    "Interdisciplinary Studies",
    "Italian",
    "Jazz Performance",
    "Journalism",
    "Kinesiology",
    "Landscape Architecture ",
    "Latin American Studies",
    "Latina/Latino Studies",
    "Learning and Education Studies",
    "Lighting Design and Technology ",
    "Linguistics",
    "Linguistics and Teaching English as a Second Language",
    "Lyric Theatre",
    "Management",
    "Marketing",
    "Materials Science and Engineering",
    "Mathematics",
    "Mathematics and Computer Science",
    "Mechanical Engineering",
    "Media and Cinema Studies",
    "Metropolitan Food and Environmental Systems",
    "Middle Grades Education (Grades 5-8)",
    "Molecular and Cellular Biology",
    "Music",
    "Music Composition ",
    "Music Education (K-12)",
    "Music Instrumental Performance",
    "Music Open Studies",
    "Music Voice Performance",
    "Musicology",
    "Natural Resources and Environmental Sciences",
    "Neural Engineering",
    "Neuroscience",
    "Nuclear, Plasma, and Radiological Engineering",
    "Operations Management",
    "Organizational and Community Leadership",
    "Philosophy",
    "Physics",
    "Plant Biotechnology",
    "Policy, International Trade & Development",
    "Political Science",
    "Portuguese",
    "Psychology",
    "Public Policy & Law",
    "Recreation, Sport and Tourism",
    "Religion",
    "Russian, East European, and Eurasian Studies",
    "Scenic Design",
    "Scenic Technology",
    "Secondary Education",
    "Secondary Education: Biology",
    "Secondary Education: Chemistry",
    "Secondary Education: Earth Science",
    "Secondary Education: English ",
    "Secondary Education: Mathematics",
    "Secondary Education: Mathematics (LAS)",
    "Secondary Education: Physics",
    "Secondary Education: Social Studies",
    "Slavic Studies",
    "Social Work",
    "Sociology",
    "Sound Design and Technology",
    "Spanish",
    "Special Education",
    "Speech and Hearing Science",
    "Stage Management",
    "Statistics",
    "Statistics and Computer Science",
    "Strategy, Innovation and Entrepreneurship",
    "Studio Art (BA)",
    "Studio Art (BFA)",
    "Supply Chain Management",
    "Sustainable Design",
    "Systems Engineering and Design ",
    "Teacher Education: French (K-12)",
    "Teacher Education: German (K-12)",
    "Teacher Education: Kinesiology - Physical Education (K-12)",
    "Teacher Education: Spanish (K-12)",
    "Theatre Studies",
    "Undeclared",
    "Urban Studies and Planning",
  ];

  const findInterests = () => {
    const promise = load(`http://127.0.0.1:5000/Home/PopularInterests`);
    promise.then(function(value) {
      myDisplayerInterests(value);
    });
  };

  useEffect(() => {
    const status = window.localStorage.getItem("token");
    console.log(status);
    setLoggedIn(status != null);
  }, []);

  const handleNumFriendsChange = (e) => {
    setNumFriends(e.target.value);
  };

  const findFriends = () => {
    const promise = load(
      `http://127.0.0.1:5000/mutual/${numFriends}/${window.localStorage.getItem(
        "token"
      )}`
    );
    promise.then(function(value) {
      myDisplayerFriends(value);
    });
  };

  const handleExpandedInterestChange = () => {
    setExpandedInterest(!expandedInterest);
  };

  const handleExpandedFriendsChange = () => {
    setExpandedFriends(!expandedFriends);
  };

  const goHome = () => {
    window.location.assign("/Home");
  };

  function myDisplayerInterests(some) {
    let query_result = [];
    for (var ix = 0; ix < some.length; ++ix) {
      const entry = some[ix];
      query_result.push({
        id: ix,
        Interest: entry[0],
      });
    }
    setInterestResults(query_result);
  }

  function myDisplayerFriends(some) {
    let query_result = [];
    for (var ix = 0; ix < some.length; ++ix) {
      const entry = some[ix];
      query_result.push({
        id: ix,
        NetID: entry[0],
        MutualFriend: entry[1],
        MutualMajor: MAJORS[entry[2]],
      });
    }
    setFriendResults(query_result);
  }

  function load(url) {
    return new Promise(async function(resolve, reject) {
      // do async thing
      const res = await fetch(url);

      // your custom code
      console.log("Yay! Loaded:", url);

      // resolve
      resolve(res.json()); // see note below!
    });
  }

  return loggedIn ? (
    <div className="centered">
      <Stack
        color="#E84A27"
        sx={{
          borderRadius: 3,
          boxShadow: 5,
          alignItems: "center",
          backgroundColor: "#EDE9E8",
          width: "80%",
        }}
        p={7}
        spacing={3}
      >
        <Typography variant="h4" color="#E84A27">
          Find Matches
        </Typography>
        <Accordion
          expanded={expandedInterest}
          onChange={handleExpandedInterestChange}
          sx={{ width: "100%" }}
        >
          <AccordionSummary
            aria-controls="interest-content"
            id="interest-header"
            expandIcon={
              expandedInterest ? (
                <KeyboardArrowRightIcon />
              ) : (
                <KeyboardArrowDownIcon />
              )
            }
          >
            <Typography>Discover Popular Interests</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Button
              onClick={findInterests}
              variant="contained"
              startIcon={<SearchIcon />}
            >
              Discover Popular Interests
            </Button>
            <div style={{ height: 450, width: "100%" }}>
              <DataGrid
                rows={interestResults}
                columns={[
                  { field: "Interest", headerName: "Interest/Hobby", flex: 1 },
                ]}
                pageSize={10}
                rowsPerPageOptions={[10]}
                checkboxSelection
              />
            </div>
          </AccordionDetails>
        </Accordion>
        <Accordion
          expanded={expandedFriends}
          onChange={handleExpandedFriendsChange}
          sx={{ width: "100%" }}
        >
          <AccordionSummary
            aria-controls="interest-content"
            id="interest-header"
            expandIcon={
              expandedInterest ? (
                <KeyboardArrowRightIcon />
              ) : (
                <KeyboardArrowDownIcon />
              )
            }
          >
            <Typography>Find Friends</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <TextField
              id="num_friends_select"
              label="Number of Friends"
              size="small"
              sx={{ width: "25%" }}
              value={numFriends}
              onChange={handleNumFriendsChange}
            />
            <Button
              onClick={findFriends}
              variant="contained"
              startIcon={<SearchIcon />}
            >
              Find Friends
            </Button>
            <div style={{ height: 450, width: "100%" }}>
              <DataGrid
                rows={friendResults}
                columns={[
                  { field: "NetID", headerName: "NetID", flex: 1 },
                  {
                    field: "MutualFriend",
                    headerName: "Mutual Friend",
                    flex: 1,
                  },
                  {
                    field: "MutualMajor",
                    headerName: "Mutual Friend's Major",
                    flex: 1,
                  },
                ]}
                pageSize={10}
                rowsPerPageOptions={[10]}
                checkboxSelection
              />
            </div>
          </AccordionDetails>
        </Accordion>
        <Button onClick={goHome} variant="contained" startIcon={<HomeIcon />}>
          Go Home
        </Button>
      </Stack>
    </div>
  ) : (
    <Login />
  );
};

export default FindFriends;
