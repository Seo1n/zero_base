/* eslint-disable no-console */
import { Box, Button, Group, Paper, TextInput } from '@mantine/core';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { baseUrl } from '../../axiosInstance/constants';
import useUser from '../../components/hooks/useUser';

function EditUserProfile() {
  const { user } = useUser();
  const navigate = useNavigate();
  const [inputs, setInputs] = useState({
    nickname: '',
    bio: '',
    baekjoonId: '',
  });

  useEffect(() => {
    if (user) {
      setInputs({
        nickname: user.nickname,
        bio: user.bio,
        baekjoonId: user.baekjoonId,
      });
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setInputs((prevInputs) => ({
      ...prevInputs,
      [name]: value,
    }));
  };

  const headers = {
    Authorization: `Bearer ${user.accessToken}`,
  };
  const handleSubmit = () => {
    axios
      .patch(
        `${baseUrl}/members/save-profile`,
        {
          nickname: inputs.nickname,
          bio: inputs.bio,
          baekjoonId: inputs.baekjoonId,
        },
        { headers },
      )
      .then((response) => {
        console.log(response);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <Box maw={400} mx="auto" m={200}>
      <Paper radius="md" p="xl" withBorder>
        <h2>프로필 수정</h2>
        <form>
          <TextInput
            mt="xl"
            id="nickname"
            label="닉네임"
            name="nickname"
            value={inputs.nickname || ''}
            onChange={handleChange}
          />
          <TextInput
            mt="xl"
            id="자기소개"
            label="자기소개"
            name="bio"
            value={inputs.bio || ''}
            onChange={handleChange}
          />
          <TextInput
            mt="xl"
            id="백준 아이디"
            label="백준 아이디"
            name="baekjoonId"
            value={inputs.baekjoonId || ''}
            onChange={handleChange}
          />

          <Group position="apart" mt={30}>
            <Button
              type="button"
              variant="outline"
              color="indigo"
              onClick={handleSubmit}
            >
              수정하기
            </Button>
            <Button
              type="button"
              variant="outline"
              color="indigo"
              onClick={() => {
                navigate('..');
              }}
            >
              취소
            </Button>
          </Group>
        </form>
      </Paper>
    </Box>
  );
}

export default EditUserProfile;
