import {
  VStack,
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  InputRightElement,
  Select,
  useToast,
  Checkbox,
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  useDisclosure,
} from "@chakra-ui/react";
import React, { useState } from "react";
import axios from "axios";
import { useHistory } from "react-router-dom";

const Signup = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmpassword, setConfirmpassword] = useState("");
  const [pic, setPic] = useState("");
  const [picLoading, setPicLoading] = useState(false);
  const [show, setShow] = useState(false);
  const [biddingType, setBiddingType] = useState("");
  const [role, setRole] = useState("user"); // Default role is user
  const [aadharNumber, setAadharNumber] = useState("");
 const [accepted, setAccepted] = useState(false);
 const { isOpen, onOpen, onClose } = useDisclosure();

    const toast = useToast();
  const history = useHistory();
const conditions = [
  "Sharing inappropriate content such as explicit images or hate speech.",
  "Engaging in harassment or bullying of other users.",
  "Attempting to hack or exploit the system.",
  "Providing false information during registration.",
  "Violating the community guidelines or terms of service.",
];

  const handleAccept = () => {
    setAccepted(!accepted);
  };
  const handleClick = () => setShow(!show);

  // const postDetails = (pics) => {
  //   // Code for uploading picture to Cloudinary
  //   // This function remains unchanged

  // };
  const postDetails = (pics) => {
    setPicLoading(true);
    if (pics === undefined) {
      toast({
        title: "Please select an image!",
        status: "warning",
        duration: "5000",
        isClosable: true,
        position: "bottom",
      });
      return;
    }

    if (pics.type === "image/jpeg" || pics.type === "image/png") {
      const data = new FormData();
      data.append("file", pics);
      data.append("upload_preset", "bidChatter");
      data.append("cloud_name", "dngqn4iag");
      fetch(`https://api.cloudinary.com/v1_1/dngqn4iag/image/upload`, {
        method: "post",
        body: data,
      })
        .then((res) => res.json())
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
    if (!name || !email || !password || !confirmpassword || !aadharNumber) {
      toast({
        title: "Please Fill all the Fields",
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
      setPicLoading(false);
      return;
    }
     if (!accepted) {
       toast({
         title: "Please Accept Terms and Conditions",
         status: "error",
         duration: 5000,
         isClosable: true,
         position: "bottom",
       });
       setPicLoading(false);
       return;
     }

    try {
      const config = {
        headers: {
          "Content-type": "application/json",
        },
      };

      const { data } = await axios.post(
        "/api/user",
        {
          name,
          email,
          password,
          pic,
          biddingType,
          role, // Include role in the request body
          aadharNumber,
        },
        config
      );

      toast({
        title: "Registration Successful",
        status: "success",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });

      localStorage.setItem("userInfo", JSON.stringify(data));
      setPicLoading(false);
      history.push("/chats"); // Redirect to the login page after successful registration
    } catch (error) {
      toast({
        title: "Error Occurred!",
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

      <FormControl id="confirm-password" isRequired>
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

      <FormControl id="aadhar-number" isRequired>
        <FormLabel htmlFor="aadhar-number">Aadhar Number</FormLabel>
        <Input
          id="aadhar-number"
          type="number" // Set type to "number" for numerical input
          placeholder="Enter your Aadhar Number"
          onChange={(e) => setAadharNumber(e.target.value)}
        />
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

      <FormControl id="bidding-type">
        <FormLabel htmlFor="bidding-type">Bidding Type</FormLabel>
        <Select
          id="bidding-type"
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

      <FormControl id="role">
        <FormLabel htmlFor="role">Role</FormLabel>
        <Select
          id="role"
          placeholder="Select role"
          value={role}
          onChange={(e) => setRole(e.target.value)}
        >
          <option value="user">User</option>
          <option value="vendor">Vendor</option>
        </Select>
      </FormControl>

      <VStack spacing="5px" color="black">
        <FormControl id="terms">
          <FormLabel>Terms and Conditions</FormLabel>
          <p>
            By using our service, you agree to abide by the following terms and
            conditions:
          </p>
          <Button onClick={onOpen} variant="outline">
            Read More
          </Button>
        </FormControl>

        <Modal isOpen={isOpen} onClose={onClose}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Terms and Conditions</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <ul>
                {conditions.map((condition, index) => (
                  <li key={index}>{condition}</li>
                ))}
              </ul>
            </ModalBody>
            <ModalFooter>
              <Button colorScheme="blue" mr={3} onClick={onClose}>
                View Less
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>

        <FormControl>
          <Checkbox isChecked={accepted} onChange={handleAccept}>
            Accept Terms and Conditions
          </Checkbox>
        </FormControl>

     
      </VStack>


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
