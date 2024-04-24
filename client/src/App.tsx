// Import dependencies
import {
  Box,
  Button,
  Flex,
  Text,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Heading,
  NumberInput,
  NumberInputField,
  Select,
  Skeleton,
  Image,
  Progress,
} from "@chakra-ui/react";
import { useState, useEffect } from "react";
import { IResult, ITeamsAndCities } from "./lib/types";
import { getTeamsAndCities, teamToCities, teamToImages } from "./lib/utilities";

function App() {
  // Loading states
  const [isLoading, setIsLoading] = useState(true);
  const [submitLoading, setSubmitLoading] = useState(false);

  // Input states
  const [battingTeam, setBattingTeam] = useState("");
  const [bowlingTeam, setBowlingTeam] = useState("");
  const [city, setCity] = useState("");
  const [target, setTarget] = useState(0);
  const [score, setScore] = useState(0);
  const [overs, setOvers] = useState(0);
  const [wickets, setWickets] = useState(0);
  const [result, setResult] = useState<IResult>();

  // Error states
  const [battingError, setBattingError] = useState({
    message: "",
    status: false,
  });
  const [bowlingError, setBowlingError] = useState({
    message: "",
    status: false,
  });
  const [cityError, setCityError] = useState({
    message: "",
    status: false,
  });
  const [targetError, setTargetError] = useState({
    message: "",
    status: false,
  });
  const [scoreError, setScoreError] = useState({
    message: "",
    status: false,
  });
  const [oversError, setOversError] = useState({
    message: "",
    status: false,
  });
  const [wicketsError, setWicketsError] = useState({
    message: "",
    status: false,
  });

  // Initial data
  const [teamsAndCities, setTeamsAndCities] = useState<ITeamsAndCities>({
    teams: [],
    cities: [],
  });

  // To get data when the component loads
  useEffect(() => {
    getTeamsAndCities(setTeamsAndCities, setIsLoading);
  }, []);

  const handleInputChange = (mutate: Function) => {
    setResult(undefined);
    mutate();
  };

  // Check the input and send to server
  const handleSubmit = async () => {
    if (battingTeam.length === 0) {
      setBattingError({ status: true, message: "Batting team is required" });
      return;
    } else {
      setBattingError({ status: false, message: "" });
    }
    if (bowlingTeam.length === 0) {
      setBowlingError({ status: true, message: "Bowling team is required" });
      return;
    } else {
      setBowlingError({ status: false, message: "" });
    }
    if (city.length === 0) {
      setCityError({ status: true, message: "City is required" });
      return;
    } else {
      setCityError({ status: false, message: "" });
    }
    if (target <= 0 || target > 720) {
      setTargetError({ status: true, message: "Invalid value for target" });
      return;
    } else {
      setTargetError({ status: false, message: "" });
    }
    if (score <= 0 || score >= target) {
      setScoreError({ status: true, message: "Invalid value for score" });
      return;
    } else {
      setScoreError({ status: false, message: "" });
    }
    if (overs <= 0 || overs >= 20) {
      setOversError({ status: true, message: "Invalid value for overs" });
      return;
    } else {
      setOversError({ status: false, message: "" });
    }
    if (wickets < 0 || wickets >= 10) {
      setWicketsError({ status: true, message: "Invalid value for wickets" });
      return;
    } else {
      setWicketsError({ status: false, message: "" });
    }

    // send to server
    setSubmitLoading(true);
    const result: IResult = await (
      await fetch("/api", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          battingTeam,
          bowlingTeam,
          city,
          target,
          score,
          overs,
          wickets,
        }),
      })
    ).json();
    setResult(result);
    setSubmitLoading(false);
  };

  // Markup
  return (
    <Flex flexDir="column">
      {/* Header */}
      <Flex p="1rem" bg="thistle">
        <Heading>IPL Win Prediction</Heading>
      </Flex>

      {/* Loader */}
      {isLoading ? (
        <Skeleton
          h="40rem"
          w="90%"
          margin="auto"
          mt="2rem"
          borderRadius="32px"
        />
      ) : (
        // Input section
        <Flex flexDir="column" p="3rem" gap="2rem">
          <Flex justifyContent="center" gap="2rem">
            {/* Batting team input */}
            <Box w="100%">
              <FormControl isInvalid={battingError.status}>
                <FormLabel>Batting Team</FormLabel>
                <Select
                  placeholder="Select team"
                  value={battingTeam}
                  onChange={(e) =>
                    handleInputChange(() => {
                      setBattingTeam(e.target.value);
                      setCity("");
                    })
                  }
                >
                  {teamsAndCities.teams
                    .filter((team) =>
                      bowlingTeam.length === 0 ? true : team != bowlingTeam
                    )
                    .map((team, idx) => (
                      <option key={idx}>{team}</option>
                    ))}
                </Select>
                <FormErrorMessage>{battingError.message}</FormErrorMessage>
              </FormControl>
            </Box>
            {/* Bowling team input */}
            <Box w="100%">
              <FormControl isInvalid={bowlingError.status}>
                <FormLabel>Bowling Team</FormLabel>
                <Select
                  placeholder="Select team"
                  value={bowlingTeam}
                  onChange={(e) =>
                    handleInputChange(() => {
                      setBowlingTeam(e.target.value);
                      setCity("");
                    })
                  }
                >
                  {teamsAndCities.teams
                    .filter((team) =>
                      battingTeam.length === 0 ? true : team != battingTeam
                    )
                    .map((team, idx) => (
                      <option key={idx}>{team}</option>
                    ))}
                </Select>
                <FormErrorMessage>{bowlingError.message}</FormErrorMessage>
              </FormControl>
            </Box>
            {/* City input */}
            <Box w="100%">
              <FormControl isInvalid={cityError.status}>
                <FormLabel>City</FormLabel>
                <Select
                  placeholder="Select city"
                  value={city}
                  onChange={(e) =>
                    handleInputChange(() => setCity(e.target.value))
                  }
                >
                  {teamsAndCities.cities
                    .filter((city) =>
                      battingTeam.length > 0 && bowlingTeam.length > 0
                        ? city === teamToCities[battingTeam] ||
                          city === teamToCities[bowlingTeam]
                        : true
                    )
                    .map((city, idx) => (
                      <option key={idx}>{city}</option>
                    ))}
                </Select>
                <FormErrorMessage>{cityError.message}</FormErrorMessage>
              </FormControl>
            </Box>
          </Flex>
          <Flex justifyContent="center" gap="2rem">
            {/* Target input */}
            <Box w="100%">
              <FormControl isInvalid={targetError.status}>
                <FormLabel>Target</FormLabel>
                <NumberInput
                  value={target}
                  onChange={(e) =>
                    handleInputChange(() => setTarget(Number(e)))
                  }
                >
                  <NumberInputField />
                </NumberInput>
                <FormErrorMessage>{targetError.message}</FormErrorMessage>
              </FormControl>
            </Box>
            {/* Score input */}
            <Box w="100%">
              <FormControl isInvalid={scoreError.status}>
                <FormLabel>Score</FormLabel>
                <NumberInput
                  value={score}
                  onChange={(e) => handleInputChange(() => setScore(Number(e)))}
                >
                  <NumberInputField />
                </NumberInput>
                <FormErrorMessage>{scoreError.message}</FormErrorMessage>
              </FormControl>
            </Box>
            {/* Overs input */}
            <Box w="100%">
              <FormControl isInvalid={oversError.status}>
                <FormLabel>Overs</FormLabel>
                <NumberInput
                  value={overs}
                  onChange={(e) => handleInputChange(() => setOvers(Number(e)))}
                >
                  <NumberInputField />
                </NumberInput>
                <FormErrorMessage>{oversError.message}</FormErrorMessage>
              </FormControl>
            </Box>
            {/* Wickets input */}
            <Box w="100%">
              <FormControl isInvalid={wicketsError.status}>
                <FormLabel>Wickets</FormLabel>
                <NumberInput
                  value={wickets}
                  onChange={(e) =>
                    handleInputChange(() => setWickets(Number(e)))
                  }
                >
                  <NumberInputField />
                </NumberInput>
                <FormErrorMessage>{wicketsError.message}</FormErrorMessage>
              </FormControl>
            </Box>
          </Flex>
          <Flex justifyContent="center">
            <Button
              colorScheme="blue"
              onClick={handleSubmit}
              isLoading={submitLoading}
            >
              Submit
            </Button>
          </Flex>
        </Flex>
      )}
      {/* Results section */}
      {result === undefined ? (
        <></>
      ) : (
        <Flex flexDirection="column" p="2rem" w="60%" margin="auto" gap="2rem">
          <Text
            fontWeight="bold"
            fontStyle="italic"
            textAlign="center"
            fontSize="1.5rem"
            color="steelblue"
          >{`Probabilty that ${battingTeam} will win: ${(
            result.probabilities.battingTeam * 100
          ).toFixed(2)} %`}</Text>
          <Progress value={result.probabilities.battingTeam * 100} />
          <Flex justifyContent="space-evenly">
            <Image
              bg="whitesmoke"
              p="1.5rem"
              borderRadius="32px"
              h="12rem"
              src={teamToImages[battingTeam]}
            />
            <Image
              bg="whitesmoke"
              p="1.5rem"
              borderRadius="32px"
              h="12rem"
              src={teamToImages[bowlingTeam]}
            />
          </Flex>
        </Flex>
      )}
    </Flex>
  );
}

export default App;
