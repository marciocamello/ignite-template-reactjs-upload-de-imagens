import { Box, Button, Stack, useToast } from '@chakra-ui/react';
import { useForm } from 'react-hook-form';
import { useState } from 'react';
import { useMutation, useQueryClient } from 'react-query';

import { api } from '../../services/api';
import { FileInput } from '../Input/FileInput';
import { TextInput } from '../Input/TextInput';

interface FormAddImageProps {
  closeModal: () => void;
}

export function FormAddImage({ closeModal }: FormAddImageProps): JSX.Element {
  const [imageUrl, setImageUrl] = useState('');
  const [localImageUrl, setLocalImageUrl] = useState('');
  const toast = useToast();

  const acceptedTypes =
    /(?:([^:/?#]+):)?(?:([^/?#]*))?([^?#](?:jpeg|gif|png))(?:\?([^#]*))?(?:#(.*))?/g;

  const formValidations = {
    image: {
      required: 'Please select an image',
      validate: {
        lessThan10MB: (files: FileList) =>
          files[0].size < 10000000 || 'File size must be less than 10MB',
        acceptedFormats: (files: FileList) =>
          acceptedTypes.test(files[0].type) || 'File must be an image',
      },
    },
    title: {
      required: 'Please enter a title',
      minLength: {
        value: 3,
        message: 'Title must be at least 3 characters',
      },
      maxLength: {
        value: 50,
        message: 'Title must be less than 50 characters',
      },
    },
    description: {
      required: {
        value: true,
        message: 'Please enter a description',
      },
      maxLength: {
        value: 65,
        message: 'Description must be less than 65 characters',
      },
    },
  };

  const queryClient = useQueryClient();
  const mutation = useMutation(
    async (image: NewImageData) => {
      await api.post('/api/images', {
        ...image,
        url: imageUrl,
      });
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries('images');
      },
    }
  );

  const { register, handleSubmit, reset, formState, setError, trigger } =
    useForm();
  const { errors } = formState;

  const onSubmit = async (data: NewImageData): Promise<void> => {
    try {
      if (!imageUrl) {
        toast({
          status: 'error',
          title: 'Image not added',
          description:
            'Please select an image before submitting the form or try again later',
        });
        return;
      }
      await mutation.mutateAsync(data);
      toast({
        title: 'No images added',
        description: 'Your image has been uploaded',
        status: 'success',
      });
    } catch {
      toast({
        title: 'Error adding image',
        description: 'Something went wrong, please try again later',
        status: 'error',
      });
    } finally {
      reset();
      setImageUrl('');
      setLocalImageUrl('');
      closeModal();
    }
  };

  return (
    <Box as="form" width="100%" onSubmit={handleSubmit(onSubmit)}>
      <Stack spacing={4}>
        <FileInput
          setImageUrl={setImageUrl}
          localImageUrl={localImageUrl}
          setLocalImageUrl={setLocalImageUrl}
          setError={setError}
          trigger={trigger}
          {...register('image', formValidations.image)}
          error={errors.image}
        />

        <TextInput
          placeholder="Image title..."
          {...register('title', formValidations.title)}
          error={errors.title}
        />

        <TextInput
          placeholder="Image description..."
          {...register('description', formValidations.description)}
          error={errors.description}
        />
      </Stack>

      <Button
        my={6}
        isLoading={formState.isSubmitting}
        isDisabled={formState.isSubmitting}
        type="submit"
        w="100%"
        py={6}
      >
        Send
      </Button>
    </Box>
  );
}
