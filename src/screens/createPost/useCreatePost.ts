import { useEffect, useMemo, useRef } from 'react';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import * as Yup from 'yup';
import { useTranslation } from 'react-i18next';

import useForm from '@/hooks/useForm';
import { useDraftStore } from '@/store/useDraftStore';
import { useAuthStore } from '@/store/useAuthStore';
import { createPost } from '@/services/api/postService';
import { rootStackParams } from '@/navigation/rootStackNavigator/rootStackParams';
import { rootStackName } from '@/navigation/rootStackNavigator/rootStackName';

export const useCreatePost = () => {
  const { t } = useTranslation();
  const navigation = useNavigation();
  const route =
    useRoute<RouteProp<rootStackParams, typeof rootStackName.CREATE_POST>>();
  const { communityId } = route.params;

  const queryClient = useQueryClient();
  const { user } = useAuthStore();
  const drafts = useDraftStore(state => state.drafts);
  const { saveDraft, clearDraft } = useDraftStore();

  // Load unsent draft for this community on mount
  const draft = useMemo(() => drafts[communityId] || { title: '', body: '' }, [drafts, communityId]);

  const postSchema = useMemo(() => {
    return Yup.object().shape({
      title: Yup.string()
        .trim()
        .required(t('createPost.validationTitleRequired')),
      body: Yup.string()
        .trim()
        .required(t('createPost.validationBodyRequired'))
        .min(10, t('createPost.validationBodyMin')),
    });
  }, [t]);

  // Mutation for creating a post
  const submitMutation = useMutation({
    mutationFn: ({
      title,
      body,
    }: {
      title: string;
      body: string;
      optimisticId: string;
    }) => createPost(communityId, title, body),
    onSuccess: (data, variables) => {
      // Replace optimistic post with the server response
      queryClient.setQueryData<any[]>(['communityPosts', communityId], old => {
        if (!old) return [];
        return old.map(post =>
          post.id === variables.optimisticId ? data : post,
        );
      });
      // Invalidate general lists to get fresh post counts
      queryClient.invalidateQueries({ queryKey: ['communities'] });
      queryClient.invalidateQueries({
        queryKey: ['communityDetails', communityId],
      });
    },
    onError: (error, variables) => {
      console.error('Post creation failed:', error);
      // Mark optimistic post as failed
      queryClient.setQueryData<any[]>(['communityPosts', communityId], old => {
        if (!old) return [];
        return old.map(post =>
          post.id === variables.optimisticId
            ? { ...post, isPending: false, isFailed: true }
            : post,
        );
      });
      // Rollback community postCount stat
      queryClient.setQueryData<ICommunity>(
        ['communityDetails', communityId],
        old => {
          if (!old) return old;
          return { ...old, postCount: Math.max(0, old.postCount - 1) };
        },
      );
    },
  });

  const form = useForm({
    initialValues: {
      title: '',
      body: '',
    },
    validationSchema: postSchema,
    onSubmit: values => {
      if (submitMutation.isPending) return;
      const optimisticId = `optimistic-${Date.now()}`;

      const optimisticPost = {
        id: optimisticId,
        communityId,
        authorId: user?.id || 'usr_test',
        title: values.title?.trim(),
        body: values.body?.trim(),
        createdAt: new Date().toISOString(),
        author: {
          id: user?.id || 'usr_test',
          name: user?.name || 'Test User',
          email: user?.email || 'test@gmail.com',
          avatar:
            user?.avatar || 'https://randomuser.me/api/portraits/men/1.jpg',
        },
        isPending: true,
        isFailed: false,
      };

      // 1. Clear local draft storage
      clearDraft(communityId);

      // 2. Prepend optimistic post to posts cache
      queryClient.setQueryData<any[]>(['communityPosts', communityId], old => {
        return [optimisticPost, ...(old || [])];
      });

      // 3. Increment postCount stat in details cache
      queryClient.setQueryData<ICommunity>(
        ['communityDetails', communityId],
        old => {
          if (!old) return old;
          return { ...old, postCount: old.postCount + 1 };
        },
      );

      // 4. Trigger background mutation
      submitMutation.mutate({
        title: values.title?.trim(),
        body: values.body?.trim(),
        optimisticId,
      });

      // 5. Instantly navigate back
      navigation.goBack();
    },
  });

  // Restore draft once on mount or when the draft store hydrates
  const hasRestored = useRef(false);
  useEffect(() => {
    if (!hasRestored.current && draft) {
      if (draft.title || draft.body) {
        form.setValues({
          title: draft.title,
          body: draft.body,
        });
      }
      hasRestored.current = true;
    }
  }, [draft, form]);

  // Auto-save draft on form input changes
  const { title, body } = form.values;
  useEffect(() => {
    saveDraft(communityId, title, body);
  }, [title, body, communityId, saveDraft]);

  return {
    form,
    isSubmitting: submitMutation.isPending,
    handleGoBack: () => navigation.goBack(),
  };
};

export default useCreatePost;
