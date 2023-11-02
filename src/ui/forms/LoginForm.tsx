import {
	Anchor,
	Box,
	Button,
	// Divider,
	Group,
	// Image,
	Paper,
	type PaperProps,
	PasswordInput,
	Stack,
	Text,
	TextInput,
	Title
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { type ReactElement } from 'react';
import { Form, useNavigate } from 'react-router-dom';
import useAuth from '../../components/auth/auth';
import useInput from '../../components/hooks/useInput';

function LoginForm(props: PaperProps): ReactElement {
	const navigate = useNavigate();
	const [email, onChangeEmail, setEmail] = useInput('');
	const [password, onChangePassword, setPassword] = useInput('');
	const auth = useAuth();

	const form = useForm({
		initialValues: {
			email: '',
			password: ''
		},

		transformValues: values => ({
			email: `${values.email}`,
			password: `${values.password}`
		})
	});

	return (
		<Box maw={500} mx="auto" mt={50}>
			<Paper radius="md" p="xl" {...props}>
				<Title
					align="center"
					sx={theme => ({
						fontFamily: `Greycliff CF, ${theme.fontFamily}`,
						fontWeight: 400
					})}
				>
					로그인
				</Title>
				<Text color="dimmed" size="sm" align="center" mt={5}>
					아직 계정이 없으신가요?
					<Anchor
						size="md"
						component="button"
						ml={5}
						mb={20}
						onClick={() => {
							navigate('/users/signup');
						}}
					>
						회원가입
					</Anchor>
				</Text>

				<Form
					onSubmit={form.onSubmit(values => {
						setEmail(values.email);
						setPassword(values.password);
					})}
				>
					<Stack>
						<TextInput
							required
							mt="xl"
							label="이메일 입력"
							placeholder="user@roadmaker.com"
							autoComplete="current-email"
							value={email}
							onChange={onChangeEmail}
							radius="md"
							size="md"
						/>

						<PasswordInput
							required
							label="비밀번호"
							placeholder="Your password"
							autoComplete="current-password"
							value={password}
							onChange={onChangePassword}
							radius="md"
							size="md"
						/>
					</Stack>

					<Group position="apart" mt="xl">
						<Button
							type="submit"
							size="lg"
							fullWidth
							variant="light"
							onClick={async () => auth.signin(email, password)}
						>
							로그인
						</Button>
					</Group>
				</Form>
			</Paper>
		</Box>
	);
}
export default LoginForm;
