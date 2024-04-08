import {
  VStack,
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  InputRightElement,
  Button,
  Show,
  useToast,
  Select
} from "@chakra-ui/react";
import React from "react";
import { useState } from "react";
import axios  from "axios";
import { useHistory } from "react-router-dom";

const Signup = () => {
  const [name, setName] = useState();
  const [email, setEmail] = useState();
  const [confirmpassword, setConfirmpassword] = useState();
  const [password, setPassword] = useState();
  const [pic, setPic] = useState();
  const [biddingType, setBiddingType] = useState("");
  const [picLoading, setPicLoading] = useState(false);
  const [show, setShow] = useState(false);
  const toast = useToast();
  const history=useHistory();
  //   Below function basically inverts the state of show variable
  const handleClick = () => setShow(!show);
  const postDetails = (pics) => {
    setPicLoading(true);
    if (pics === undefined) {
      //toast gives notifications to the user 
      toast({
        title: "Please select an image!",
        status: "warning",
        duration: "5000",
        isClosable: true,
        position: "bottom",
      });
      return;
    }
//Only selected pic is of type image can be pushed to cloudinary.
    if (pics.type === "image/jpeg" || pics.type === "image/png") {
      //Make a new object named FormData
      const data = new FormData();
      //The image file (pics) is appended to the FormData object with the key "file".
      data.append("file", pics);
      //Other parameers related to cloudinary are also appended to the FormData object.
      data.append("upload_preset", "bidChatter");
      data.append("cloud_name", "dngqn4iag");
     // The fetch function is used to make a POST request to the Cloudinary API endpoint for uploading images.
      fetch(`https://api.cloudinary.com/v1_1/dngqn4iag/image/upload`, {
        method: "post",
        body: data,
      })
        //the response is converted to JSON using res.json().
        .then((res) => res.json())
      //The URL of the uploaded image is extracted from the response
      // data (data.url) and  setPic unction sets the value of variable pic to the converted string url. 
      //The setPicLoading function is called to indicate that the image upload 
      //process is complete.
        .then((data) => {
          setPic(data.url.toString());
          console.log(data.url.toString());
          setPicLoading(false);
        })
        .catch((err) => {
          console.log(err);
          setPicLoading(false);
        });
    } else {
      toast({
        title: "Please Select an Image!",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      setPicLoading(false);
      return;
    }
  };
  const submitHandler = async () => {
    setPicLoading(true);
    if (!name || !email || !password || !confirmpassword) {
      toast({
        title: "Please Fill all the Feilds",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      setPicLoading(false);
      return;
    }
    if (password !== confirmpassword) {
      toast({
        title: "Passwords Do Not Match",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      return;
    }
    //console.log(name, email, password, pic);
    //set up the HTTP request configuration with headers specifying the content type as JSON.
    try {
      const config = {
        headers: {
          "Content-type": "application/json",
        },
      };
      //It makes a POST request to the /api/user endpoint (assuming it's the endpoint for user registration) with the user data (name, email, password, pic) in the request body.
//If the request is successful, a success toast notification is displayed, and the user information (data) received from the server is stored in local storage for authentication purposes.
      const { data } = await axios.post(
        "/api/user",
        {
          name,
          email,
          password,
          pic,
          biddingType,
        },
        config
      );
      console.log(data);
      toast({
        title: "Registration Successful",
        status: "success",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      localStorage.setItem("userInfo", JSON.stringify(data));
      setPicLoading(false);
      history.push("/");
    } catch (error) {
      toast({
        title: "Error Occured!",
        description: error.response.data.message,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      setPicLoading(false);
    }
  };
  return (
    <VStack spacing="5px" color="black">
      <FormControl id="first-name" isRequired>
        <FormLabel htmlFor="name">Name</FormLabel>
        <Input
          id="name"
          placeholder="Enter your name"
          onChange={(e) => setName(e.target.value)}
        />
      </FormControl>

      <FormControl id="email" isRequired>
        <FormLabel htmlFor="email">Email</FormLabel>
        <Input
          id="email"
          placeholder="Enter your Email"
          onChange={(e) => setEmail(e.target.value)}
        />
      </FormControl>

      <FormControl id="password" isRequired>
        <FormLabel htmlFor="password">Password</FormLabel>
        <InputGroup>
          <Input
            id="password"
            type={show ? "text" : "password"}
            placeholder="Enter your Password"
            onChange={(e) => setPassword(e.target.value)}
          />
          <InputRightElement width="4.5rem">
            <Button h="1.75rem" size="sm" onClick={handleClick}>
              {show ? "Hide" : "Show"}
            </Button>
          </InputRightElement>
        </InputGroup>
      </FormControl>

      <FormControl id="password" isRequired>
        <FormLabel htmlFor="confirm-password">Confirm Password</FormLabel>
        <InputGroup>
          <Input
            id="confirm-password"
            type={show ? "text" : "password"}
            placeholder="Confirm Password"
            onChange={(e) => setConfirmpassword(e.target.value)}
          />
          <InputRightElement width="4.5rem">
            <Button h="1.75rem" size="sm" onClick={handleClick}>
              {show ? "Hide" : "Show"}
            </Button>
          </InputRightElement>
        </InputGroup>
      </FormControl>

      <FormControl id="pic">
        <FormLabel htmlFor="pic">Upload your Picture</FormLabel>
        <Input
          type="file"
          p={1.5}
          accept="image/*"
          id="pic"
          placeholder="Enter your Picture"
          onChange={(e) => postDetails(e.target.files[0])}
        />
      </FormControl>

      <FormControl id="biddingType" isRequired>
        <FormLabel htmlFor="biddingType">Bidding Type</FormLabel>
        <Select
          id="biddingType"
          placeholder="Select bidding type"
          onChange={(e) => setBiddingType(e.target.value)}
        >
          <option value="Type 1">Type 1</option>
          <option value="Type 2">Type 2</option>
          <option value="Type 3">Type 3</option>
          <option value="Type 4">Type 4</option>
          <option value="Type 5">Type 5</option>
        </Select>
      </FormControl>

      <Button
        colorScheme="blue"
        width="100%"
        style={{ marginTop: 15 }}
        onClick={submitHandler}
        isLoading={picLoading}
      >
        Sign Up
      </Button>
    </VStack>
  );
};

export default Signup;
