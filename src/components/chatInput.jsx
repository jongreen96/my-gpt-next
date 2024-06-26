'use client';

import ChatSettingsPopover from '@/components/chatSettings';
import { ArrowDown, Loader2Icon, SendHorizonal } from 'lucide-react';
import { useEffect, useState } from 'react';
import TextAreaAuto from 'react-textarea-autosize';
import ImageInput from './imageInput';
import ImageTray from './imageTray';
import { Button } from './ui/button';
import LoadingButton from './ui/loadingButton';

export default function ChatInput({
  input,
  handleInputChange,
  handleSubmit,
  inputRef,
  isLoading,
  settings,
  setSettings,
  started,
  messages,
}) {
  const [images, setImages] = useState([]);
  const [tempImages, setTempImages] = useState([]);

  useEffect(() => {
    if (isLoading && messages[messages.length - 1]?.role === 'user') {
      messages[messages.length - 1].images = tempImages;
    }
  }, [isLoading, messages, tempImages]);

  return (
    <form
      onSubmit={(e) => {
        handleSubmit(e, { data: { images } });
        setTempImages(images);
        setImages([]);
      }}
      className='sticky bottom-0 mx-auto flex w-full max-w-7xl gap-2 p-2'
    >
      <ChatSettingsMessage input={input} started={started} />

      <ChatSettingsPopover
        settings={settings}
        setSettings={setSettings}
        started={started}
      />

      <div className='flex w-full min-w-0 flex-col rounded-[20px] border border-input bg-background px-3 py-2 shadow'>
        <ImageTray images={images} setImages={setImages} />

        <div className='flex gap-2'>
          <TextAreaAuto
            autoFocus
            maxRows={15}
            ref={inputRef}
            value={input}
            placeholder='Say something...'
            onChange={handleInputChange}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                if (!isLoading) {
                  handleSubmit(e, {
                    data: {
                      images,
                    },
                  });
                  setTempImages(images);
                  setImages([]);
                }
              }
            }}
            className='grow resize-none bg-background focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50'
          />
          <ImageInput
            images={images}
            setImages={setImages}
            settings={settings}
          />
        </div>
      </div>

      {isLoading ? (
        <Button
          disabled
          size='icon'
          className='aspect-square self-end rounded-full'
        >
          <Loader2Icon className='animate-spin' />
        </Button>
      ) : (
        <LoadingButton
          size='icon'
          type='submit'
          loading={isLoading}
          className='aspect-square self-end rounded-full'
        >
          <SendHorizonal />
        </LoadingButton>
      )}
    </form>
  );
}

function ChatSettingsMessage({ input, started }) {
  if (input || started) return null;
  return (
    <div className='absolute -top-4 left-[18px] flex items-center gap-2 text-muted-foreground'>
      <ArrowDown size={20} />
      <p className='text-sm'>Change chat settings here</p>
    </div>
  );
}
