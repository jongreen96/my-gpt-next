import { ArrowDown, Loader2Icon, SendHorizonal } from 'lucide-react';
import TextAreaAuto from 'react-textarea-autosize';
import ImageSettingsPopover from './imageSettings';
import { Button } from './ui/button';
import LoadingButton from './ui/loadingButton';

export default function ImageGenerationInput({
  input,
  setInput,
  inputRef,
  handleSubmit,
  isLoading,
  started,
  settings,
  setSettings,
}) {
  return (
    <form
      onSubmit={(e) => handleSubmit(e)}
      className='sticky bottom-0 mx-auto flex w-full max-w-7xl gap-2 p-2'
    >
      <ChatSettingsMessage input={input} started={started} />

      <ImageSettingsPopover
        started={started}
        settings={settings}
        setSettings={setSettings}
      />

      <div className='flex w-full min-w-0 flex-col rounded-[20px] border border-input bg-background px-3 py-2 shadow'>
        <TextAreaAuto
          autoFocus
          maxRows={15}
          ref={inputRef}
          value={input}
          placeholder='Say something...'
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              handleSubmit(e);
            }
          }}
          className='grow resize-none bg-background focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50'
        />
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
      <p className='text-sm'>Change image settings here</p>
    </div>
  );
}
