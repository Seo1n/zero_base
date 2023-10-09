import {
  Anchor,
  Box,
  Button,
  Center,
  Modal,
  Paper,
  type PaperProps,
  PasswordInput,
  Text,
  TextInput,
  Title,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import {
  IconAlertCircleFilled,
  IconCircleCheckFilled,
} from '@tabler/icons-react';
import { type ReactElement } from 'react';
import { useNavigate } from 'react-router-dom';

import { useAuth } from '../../../auth/useAuth';
import { useInput } from '../../common/hooks/useInput';

function SignUpForm(props: PaperProps): ReactElement {
  const [email, onChangeEmail, setEmail] = useInput('');
  const [nickname, onChangeNickname, setNickname] = useInput('');
  const [password, onChangePassword, setPassword] = useInput('');
  const [confirmPassword, onChangeConfirmPassword, setConfirmPassword] =
    useInput('');
  const auth = useAuth();
  const navigate = useNavigate();

  const form = useForm({
    initialValues: {
      nickname: '',
      email: '',
      password: '',
      confirmPassword: '',
    },

    validateInputOnChange: true,

    validate: {
      nickname: (value) =>
        value.length < 2 ? '닉네임은 2글자 이상이어야합니다' : null,
      email: (value) =>
        /^\S+@\S+$/.test(value) ? null : '유효한 이메일이 아닙니다',
      confirmPassword: (value, values) =>
        value !== values.password || value === ''
          ? '비밀번호가 일치하지 않습니다'
          : null,
      password: (value) =>
        value.length < 8 || /^[A-Za-z0-9]{8,20}$/.test(value)
          ? '비밀번호는 영문, 숫자, 특수문자를 조합해서 8자 이상 입력해주세요'
          : null,
    },
    transformValues: (values) => ({
      nickname: `${values.nickname}`,
      email: `${values.email}`,
      password: `${values.password}`,
      confirmPassword: `${values.confirmPassword}`,
    }),
  });

  return (
    <Box maw={500} m="auto" mt={50}>
      {auth.isUserModalOpen && (
        <Modal
          opened={auth.isUserModalOpen}
          onClose={() => auth.setIsUserModalOpen(false)}
          size="40%"
        >
          {auth.success ? (
            <>
              <Center pt={40}>
                <IconCircleCheckFilled
                  size={150}
                  style={{ color: '#38D9A9' }}
                />
              </Center>
              <Text ta="center" c="teal.4" fz={35} mt={20}>
                회원가입 성공
              </Text>
              <Text ta="center" mt={10}>
                로드메이커에 오신 것을 환영합니다!
              </Text>
              <Button
                fullWidth
                type="submit"
                mt={50}
                variant="light"
                color="teal.4"
                h={50}
                onClick={() => {
                  navigate('/users/signin');
                }}
              >
                로그인 하러 가기
              </Button>
            </>
          ) : (
            <>
              <Center pt={40}>
                <IconAlertCircleFilled
                  size={150}
                  style={{ color: '#FA5252' }}
                />
              </Center>
              <Text ta="center" c="#FA5252" fz={35} mt={20}>
                회원가입 실패
              </Text>
              <Text ta="center" mt={10}>
                {auth.modalText}
              </Text>
              <Button
                fullWidth
                type="submit"
                mt={50}
                variant="light"
                color="red.6"
                h={50}
                onClick={() => auth.setIsUserModalOpen(false)}
              >
                확인
              </Button>
            </>
          )}
        </Modal>
      )}
      <Paper radius="md" p="xl" {...props}>
        <Title order={1} align="center" fw={400}>
          회원가입
        </Title>
        <Text color="dimmed" size="md" align="center" mt={5}>
          이미 계정이 있으신가요?
          <Anchor
            size="md"
            component="button"
            ml={5}
            mb={20}
            onClick={() => {
              navigate('/users/signin');
            }}
          >
            로그인
          </Anchor>
        </Text>
        <form
          onSubmit={form.onSubmit(async (values) => {
            const enteredEmail = values.email;
            const enteredPassword = values.password;
            const enteredNickname = values.nickname;

            setNickname(enteredNickname);
            setEmail(enteredEmail);
            setPassword(enteredPassword);
            setConfirmPassword(values.confirmPassword);
            await auth.signup(enteredEmail, enteredPassword, enteredNickname);
          })}
        >
          <TextInput
            mt="xl"
            size="md"
            radius="md"
            label="닉네임"
            placeholder="닉네임을 입력해주세요"
            withAsterisk
            value={nickname}
            onChange={onChangeNickname}
            {...form.getInputProps('nickname')}
          />
          <TextInput
            size="md"
            mt="xl"
            radius="md"
            label="이메일"
            placeholder="이메일을 입력해주세요"
            withAsterisk
            value={email}
            onChange={onChangeEmail}
            {...form.getInputProps('email')}
          />
          <PasswordInput
            mt="xl"
            size="md"
            radius="md"
            label="비밀번호"
            placeholder="비밀번호를 입력해주세요"
            withAsterisk
            value={password}
            onChange={onChangePassword}
            {...form.getInputProps('password')}
          />
          <PasswordInput
            mt="xl"
            size="md"
            radius="md"
            label="비밀번호 확인"
            placeholder="비밀번호를 입력해주세요"
            withAsterisk
            value={confirmPassword}
            onChange={onChangeConfirmPassword}
            {...form.getInputProps('confirmPassword')}
          />
          <Center>
            <Button
              fullWidth
              type="submit"
              mt={50}
              size="lg"
              variant="light"
              onClick={() => {
                auth.setModalText('');
              }}
            >
              회원가입
            </Button>
          </Center>
        </form>
      </Paper>
    </Box>
  );
}

export default SignUpForm;
