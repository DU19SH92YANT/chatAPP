
import { Container, Typography, Button, Box, Avatar } from '@mui/material';


function Home() {
  return (
    <Container className="home" maxWidth="md">
    <Box display="flex" flexDirection="column" alignItems="center" textAlign="center" mt={4}>
      <Avatar
        alt="Your Name"
        src="/path-to-your-image.jpg"
        sx={{ width: 120, height: 120, mb: 2 }}
      />
      <Typography variant="h2" component="h1" gutterBottom>
        Hello, I&apos;m [Your Name]!
      </Typography>
      <Typography variant="h5" gutterBottom>
        Full-Stack Developer | MERN Stack Specialist
      </Typography>
      <Typography variant="body1" paragraph>
        I am passionate about building efficient, scalable, and user-friendly web applications. With expertise in React.js, Node.js, Express.js, and MongoDB, I deliver full-stack solutions that drive success.
      </Typography>
      <Typography variant="body2" color="textSecondary" paragraph>
        This portfolio is a showcase of my skills and journey as a developer. I am actively seeking exciting opportunities to contribute and grow.
      </Typography>
      <Button variant="contained" color="primary" href="/projects">
        Projects
      </Button>
    </Box>
  </Container>
  );
}

export default Home