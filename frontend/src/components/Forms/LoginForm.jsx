import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { auth } from '../../firebase-config';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { ToastContainer, toast } from 'react-toastify';
import { useNavigate, Link as RouterLink } from 'react-router-dom'; 
import 'react-toastify/dist/ReactToastify.css';
import LoginProvider from './LoginProvider';
import pic1 from './pic1.png'
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  FormErrorMessage,
  Heading,
  VStack,
  HStack,
  Divider,
  Text,
  Link as ChakraLink,
  Spinner,
  Flex,
} from '@chakra-ui/react';

const LoginForm = () => {
  const [loading, setLoading] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const navigate = useNavigate();

  const handleLogin = async (data) => {
    try {
      setLoading(true);
      await signInWithEmailAndPassword(auth, data.email, data.password);
      toast.success('Login successful');
      navigate('/dashboard');
    } catch (error) {
      toast.error('Login failed: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      display="flex"
      minHeight="100vh"
      bgGradient="linear(to-r, #3b206a, #5d3a90)"
      px={4}
    >
      <Flex
        direction="column"
        justifyContent="center"
        alignItems="center"
        width="50%"
        bg="transparent"
        color="white"
      >
       <div>
        <img src={pic1} alt="pic1" />
       </div>
        <Heading size="lg" mb={4} className='libre-baskerville-regular-italic'>
          Emo-Diary 
        </Heading>
        <Text fontSize="lg" mb={6} className='libre-baskerville-regular-italic'>
          Welcome to your personal mental wellness
        </Text>
      </Flex>

      <Flex
        alignItems="center"
        justifyContent="center"
        width="50%"
        bg="white"
        borderRadius="lg"
        p={8}
        shadow="lg"
      >
        <Box width="100%" maxW="md">
          <Heading as="h2" size="xl" textAlign="center" mb={6}  className='text-black'>
            Welcome Back...
          </Heading>

          <form onSubmit={handleSubmit(handleLogin)} className='text-black'>
            <VStack spacing={4} align="stretch" width="100%">
              {/* Email Field */}
              <FormControl isInvalid={errors.email}>
                <FormLabel htmlFor="email">Email</FormLabel>
                <Input
                  type="email"
                  id="email"
                  placeholder="user@gmail.com"
                  {...register('email', {
                    required: 'Email is required',
                    pattern: {
                      value:
                        /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: 'Invalid email address',
                    },
                  })}
                />
                <FormErrorMessage>
                  {errors.email && errors.email.message}
                </FormErrorMessage>
              </FormControl>

              {/* Password Field */}
              <FormControl isInvalid={errors.password}>
                <FormLabel htmlFor="password">Password</FormLabel>
                <Input
                  type="password"
                  id="password"
                  placeholder="********"
                  {...register('password', {
                    required: 'Password is required',
                    minLength: {
                      value: 8,
                      message: 'Password must be at least 8 characters long',
                    },
                  })}
                />
                <FormErrorMessage>
                  {errors.password && errors.password.message}
                </FormErrorMessage>
                <ChakraLink
                  as={RouterLink}
                  to="/forgot"
                  color="blue.500"
                  fontSize="sm"
                  mt={1}
                  textAlign="right"
                  display="block"
                >
                  Forgot Password?
                </ChakraLink>
              </FormControl>

              {/* Login Button */}
              <Button 
                type="submit"
                colorScheme="blue"
                width="100%" // Full-width button
                isDisabled={loading}
                leftIcon={loading && <Spinner size="sm" />}
              >
                {loading ? 'Loading...' : 'Login'}
              </Button>
            </VStack>
          </form>

          {/* Divider and alternative login methods */}
          <HStack my={6} alignItems="center">
            <Divider />
            <Text fontSize="sm" color="gray.600">
              or
            </Text>
            <Divider />
          </HStack>

          {/* Other login providers */}
          <LoginProvider />

          <HStack my={6} alignItems="center" justifyContent="center">
            <Text fontSize="sm" color="gray.600">
              Don't have an account?
            </Text>
            <ChakraLink as={RouterLink} to="/signup" color="blue.500">
              Create Account
            </ChakraLink>
          </HStack>

          <ToastContainer />
        </Box>
      </Flex>
    </Box>
  );
};

export default LoginForm;
