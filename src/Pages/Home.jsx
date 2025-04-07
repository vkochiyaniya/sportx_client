import {
  Box,
  Button,
  Flex,
  Grid,
  Heading,
  Image,
  Stack,
  Text,
} from "@chakra-ui/react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Carousel from "../components/Carousel/Carousel";
import Loading from "../components/Loading/Loading";
import Trending from "../components/Trends/Trending";
import { imagesData } from "../utils/data";
import Navbar from "../components/Navbar/Navbar";

const Home = () => {
  const loading = useSelector((store) => store.pagesReducer.isLoading);
  const navigate = useNavigate();

  return (
    <Box>
      <Navbar />
      {loading ? (
        <Loading />
      ) : (
        <>
          <Box w="95%" m="auto" mt={4}>
            <Carousel />
            <Trending />
          </Box>

          <Box my={10}>
            <Stack spacing={5} mx={4} my={6}>
              <Heading textAlign="left" fontSize="2xl">
                WHO ARE YOU SHOPPING FOR?
              </Heading>
              <Grid
                templateColumns={["1fr", "repeat(2, 1fr)", "repeat(3, 1fr)"]}
                gap={4}
              >
                {imagesData.map((item) => (
                  <Box
                    key={item.id}
                    position="relative"
                    overflow="hidden"
                    borderRadius="md"
                    _hover={{
                      transform: "scale(1.02)",
                      transition: "transform 0.3s ease",
                    }}
                  >
                    <Image
                      src={item.link}
                      alt={item.title}
                      objectFit="cover"
                      w="full"
                      h={["50vh", "60vh"]}
                    />
                    <Box
                      position="absolute"
                      bottom={4}
                      left={4}
                      color="white"
                    >
                      <Heading fontSize={["xl", "2xl"]}>{item.product}</Heading>
                      <Button
                        mt={2}
                        colorScheme="teal"
                        onClick={() => navigate(item.route)}
                      >
                        SHOP NOW
                      </Button>
                    </Box>
                  </Box>
                ))}
              </Grid>
            </Stack>
          </Box>

          <Box my={10}>
            <Stack spacing={5} mx={4} my={6} w="95%" m="auto">
              <Heading fontSize="2xl">MEN’S CLOTHING & SHOES</Heading>
              <Text fontSize={["sm", "md"]}>
                As a creator, you look for ways to excel and express yourself when
                and where you can, from reaching for that last rep to evolving your
                streetwear style. Log miles or tear down the baseline in men's shoes
                with responsive cushioning. Rep an athletic style off the field in
                lifestyle apparel born of sport heritage.
              </Text>
            </Stack>

            <Flex
              bg="yellow.400"
              color="black"
              p={8}
              direction="column"
              align="center"
              textAlign="center"
            >
              <Heading mb={4} fontSize="2xl">
                JOIN ADIDAS AND GET 15% OFF
              </Heading>
              <Button
                colorScheme="blackAlpha"
                size="lg"
                onClick={() => navigate("/register")}
              >
                Sign Up
              </Button>
            </Flex>
          </Box>
        </>
      )}
    </Box>
  );
};

export default Home;