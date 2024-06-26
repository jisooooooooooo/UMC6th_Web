import React, { useState } from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";

const Container = styled.div`
  height: 100vh;
  background-color: #1f1f43;
  display: flex;
  justify-content: center;
`;

const Title = styled.div`
  font-size: 20px;
  color: white;
  margin-bottom: 30px;
  @media (max-width: 768px) {
    font-size: 18px;
    margin-bottom: 20px;
  }

  @media (max-width: 480px) {
    font-size: 16px;
    margin-bottom: 15px;
  }
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 30px;
`;

const Input = styled.input`
  width: 500px;
  height: 40px;
  padding-left: 15px;
  border: none;
  margin-bottom: 15px;
  border-radius: 20px;
  @media (max-width: 768px) {
    width: 400px;
    height: 30px;
  }

  @media (max-width: 480px) {
    width: 300px;
    height: 25px;
  }
`;

const Button = styled.button`
  width: 500px;
  height: 50px;
  font-size: 15px;
  font-weight: bold;
  border-radius: 25px;
  margin-bottom: 40px;
  margin-top: 40px;
  background-color: ${(props) => (props.enabled ? "#ffd700" : "white")};
  @media (max-width: 768px) {
    width: 380px;
    height: 40px;
    font-size: 13px;
    margin-bottom: 30px;
    margin-top: 30px;
  }

  @media (max-width: 480px) {
    width: 250px;
    height: 35px;
    font-size: 12px;
    margin-bottom: 25px;
    margin-top: 25px;
  }
`;

const Wrapper = styled.div`
  display: flex;
  align-items: center;
`;

const Id = styled.div`
  color: white;
  margin-right: 20px;
  @media (max-width: 768px) {
    margin-right: 10px;
    font-size: 14px;
  }

  @media (max-width: 480px) {
    margin-right: 10px;
    font-size: 12px;
    
  }
`;

const LoginLink = styled(Link)`
  color: white;
  font-weight: bold;
  text-decoration: none;
  @media (max-width: 768px) {
    font-size: 14px;
  }

  @media (max-width: 480px) {
    font-size: 12px;
  }
`;

const ErrorBox = styled.div`
  text-align: left;
  width: 500px;
  @media (max-width: 768px) {
    width: 400px;
  }

  @media (max-width: 480px) {
    width: 300px;
  }
`;

const ErrorMessage = styled.div`
  color: red;
  font-size: 12px;
  margin-bottom: 10px;
  @media (max-width: 768px) {
    font-size: 11px;
    margin-bottom: 10px;
  }

  @media (max-width: 480px) {
    font-size: 10px;
    margin-bottom: 10px;
  }
`;

const Login = ({ onLogin }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});

  const validateInputs = () => {
    const errors = {};

    if (!username.trim()) {
      errors.username = "아이디를 입력해주세요!";
    }

    if (password.length < 4) {
      errors.password = "비밀번호는 4자 이상이어야 합니다!";
    }

    if (password.length === "null") {
      errors.password = "비밀번호를 입력해주세요!";
    }

    return errors;
  };

  const handleInputChange = (setter, value) => {
    setter(value);
    setErrors({});
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const errors = validateInputs();
    if (Object.keys(errors).length === 0) {
      try {
        const response = await fetch("http://localhost:8080/auth/login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            username,
            password,
          }),
        });
        if (!response.ok) {
          throw new Error("Failed to login");
        }
        const data = await response.json();
        localStorage.setItem("token", data.token); // Save token to local storage
        onLogin(data.token); // Pass token to parent component
        console.log("로그인 완료");
        window.location.href = "/";
      } catch (error) {
        console.error("Error logging in: ", error);
        setErrors({ login: "로그인에 실패했습니다. 다시 시도해주세요." });
      }
    } else {
      setErrors(errors);
    }
  };

  return (
    <Container>
      <Form onSubmit={handleSubmit}>
        <Title>로그인 페이지</Title>
        <Input
          type="text"
          placeholder="아이디"
          value={username}
          onChange={(e) => handleInputChange(setUsername, e.target.value)}
        />
        <ErrorBox>
          {errors.username && <ErrorMessage>{errors.username}</ErrorMessage>}
        </ErrorBox>
        <Input
          type="password"
          placeholder="비밀번호"
          value={password}
          onChange={(e) => handleInputChange(setPassword, e.target.value)}
        />
        <ErrorBox>
          {errors.password && <ErrorMessage>{errors.password}</ErrorMessage>}
          {errors.login && <ErrorMessage>{errors.login}</ErrorMessage>}
        </ErrorBox>
        <Button type="submit" enabled={!Object.keys(errors).length}>
          로그인
        </Button>
        <Wrapper>
          <Id>아직 계정이 없으신가요?</Id>
          <LoginLink to="/signup">회원가입 페이지로 이동하기</LoginLink>
        </Wrapper>
      </Form>
    </Container>
  );
};

export default Login;
