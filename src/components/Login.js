// import {
//   Typography,
//   Stack,
//   TextField,
//   Button,
//   Link,
//   Alert,
// } from "@mui/material";
// import React, { useEffect, useState } from "react";
// import Home from "./Home";

// const Login = (props) => {
//   const [loggedIn, setLoggedIn] = useState(false);
//   const [failedLogin, setFailedLogin] = useState(false);
//   const [username, setUsername] = useState("");
//   const [password, setPassword] = useState("");

//   useEffect(() => {
//     const status = window.localStorage.getItem("token");
//     console.log(status);
//     setLoggedIn(status != null);
//   }, []);

//   const handleUsernameChange = (e) => {
//     setUsername(e.target.value);
//   };

//   const handlePasswordChange = (e) => {
//     setPassword(e.target.value);
//   };

//   const onSubmit = async () => {
//     // Make a get request to the database, to see if the password matches
//     // REMEMBER TO PUT GET REQUEST HERE
//     const data = {
//       username: username,
//       password: password,
//     };
//     try {
//       const response = await fetch("http://127.0.0.1:5000/login", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify(data),
//       });
//       if (response.status == 200) {
//         const data = await response.json();
//         if (data.successful) {
//           window.localStorage.setItem("token", username);
//           setLoggedIn(true);
//           window.location.assign('/Home');
//         }
//       } else {
//         setFailedLogin(true);
//       }
//     } catch (e) {
//       console.log(e);
//     }
//   };

//   return loggedIn ? (
//     <Home />
//   ) : (
//     <div className="centered">
//       <Stack
//         color="#E84A27"
//         spacing={3.5}
//         sx={{
//           borderRadius: 3,
//           boxShadow: 5,
//           alignItems: "center",
//           backgroundColor: "#EDE9E8",
//         }}
//         p={7}
//       >
//         <div className="meet">
//           <Typography variant="h2">Match and Meet</Typography>
//         </div>
//         <Typography variant="h6">Don't have an account?</Typography>
//         <Link href="/register">{"Register here."}</Link>
//         <TextField
//           id="outlined-basic"
//           label="Username"
//           sx={{ width: "50%" }}
//           value={username}
//           onChange={handleUsernameChange}
//         />
//         <TextField
//           id="outlined-basic"
//           label="Password"
//           type="password"
//           sx={{ width: "50%" }}
//           value={password}
//           onChange={handlePasswordChange}
//         />
//         {failedLogin && (
//           <Alert
//             severity="error"
//             onClose={() => {
//               setFailedLogin(false);
//             }}
//             variant="filled"
//           >
//             Invalid Credentials
//           </Alert>
//         )}
//         <Button onClick={onSubmit} variant="contained">
//           Login
//         </Button>
//       </Stack>
//     </div>
//   );
// };

// export default Login;
import {
  Typography,
  Stack,
  TextField,
  Button,
  Link,
  Alert,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import Home from "./Home";

const Login = (props) => {
  const [loggedIn, setLoggedIn] = useState(false);
  const [failedLogin, setFailedLogin] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    const status = window.localStorage.getItem("token");
    console.log(status);
    setLoggedIn(status != null);
  }, []);

  const handleUsernameChange = (e) => {
    setUsername(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const onSubmit = async () => {
    // Make a get request to the database, to see if the password matches
    // REMEMBER TO PUT GET REQUEST HERE
    const data = {
      username: username,
      password: password,
    };
    try {
      const response = await fetch("http://127.0.0.1:5000/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      if (response.status === 200) {
        const data = await response.json();
        if (data.successful) {
          window.localStorage.setItem("token", username);
          setLoggedIn(true);
          window.location.assign("/home");
        }
      } else {
        setFailedLogin(true);
      }
    } catch (e) {
      console.log(e);
    }
  };

  return loggedIn ? (
    <Home />
  ) : (
    <div className="centered">
      <Stack
        color="#E84A27"
        spacing={3.5}
        sx={{
          borderRadius: 3,
          boxShadow: 5,
          alignItems: "center",
          backgroundColor: "#EDE9E8",
        }}
        p={7}
      >
        <div className="meet">
          <Typography variant="h2">Match and Meet</Typography>
        </div>
        <Typography variant="h6">Don't have an account?</Typography>
        <Link href="/register">{"Register here."}</Link>
        <TextField
          id="outlined-basic"
          label="Username"
          sx={{ width: "50%" }}
          value={username}
          onChange={handleUsernameChange}
        />
        <TextField
          id="outlined-basic"
          label="Password"
          type="password"
          sx={{ width: "50%" }}
          value={password}
          onChange={handlePasswordChange}
        />
        {failedLogin && (
          <Alert
            severity="error"
            onClose={() => {
              setFailedLogin(false);
            }}
            variant="filled"
          >
            Invalid Credentials
          </Alert>
        )}
        <Button onClick={onSubmit} variant="contained">
          Login
        </Button>
      </Stack>
    </div>
  );
};

export default Login;
