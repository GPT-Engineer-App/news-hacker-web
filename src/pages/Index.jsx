import React, { useEffect, useState } from "react";
import { Container, VStack, Text, Link, Spinner, Heading, Box } from "@chakra-ui/react";
import { FaHackerNews } from "react-icons/fa";

const Index = () => {
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTopStories = async () => {
      try {
        const response = await fetch("https://hacker-news.firebaseio.com/v0/topstories.json");
        const storyIds = await response.json();
        const top10StoryIds = storyIds.slice(0, 10);

        const storyPromises = top10StoryIds.map(async (id) => {
          const storyResponse = await fetch(`https://hacker-news.firebaseio.com/v0/item/${id}.json`);
          return storyResponse.json();
        });

        const stories = await Promise.all(storyPromises);
        setStories(stories);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching top stories:", error);
        setLoading(false);
      }
    };

    fetchTopStories();
  }, []);

  return (
    <Container centerContent maxW="container.md" py={8}>
      <VStack spacing={4} align="stretch">
        <Box display="flex" alignItems="center">
          <FaHackerNews size="2em" color="brand.900" />
          <Heading as="h1" size="lg" ml={2} color="brand.900">
            Hacker News Top Stories
          </Heading>
        </Box>
        {loading ? (
          <Spinner size="xl" />
        ) : (
          stories.map((story) => (
            <Box key={story.id} p={4} borderWidth="1px" borderRadius="md" boxShadow="sm">
              <Link href={story.url} isExternal fontSize="xl" fontWeight="bold" color="brand.800">
                {story.title}
              </Link>
              <Text fontSize="sm" color="gray.500">
                by {story.by} | {new Date(story.time * 1000).toLocaleString()}
              </Text>
            </Box>
          ))
        )}
      </VStack>
    </Container>
  );
};

export default Index;
