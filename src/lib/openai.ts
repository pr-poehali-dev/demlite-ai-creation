// Интеграция с OpenAI API
const OPENAI_API_KEY = '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';

// Типы для запросов и ответов
interface OpenAITextResponse {
  choices: {
    message: {
      content: string;
      role: string;
    };
  }[];
}

interface OpenAIImageResponse {
  data: {
    url: string;
  }[];
}

export type MessageType = {
  role: 'user' | 'assistant' | 'system';
  content: string;
  type?: 'text' | 'image' | 'code' | 'file';
  imageUrl?: string;
};

// Функция для генерации текстового ответа
export const generateTextResponse = async (messages: MessageType[]): Promise<MessageType> => {
  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: messages.map(({role, content}) => ({role, content})),
        temperature: 0.7
      })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error?.message || 'Ошибка при запросе к OpenAI');
    }

    const data = await response.json() as OpenAITextResponse;
    const content = data.choices[0]?.message.content || 'Извините, не удалось сгенерировать ответ.';
    
    // Определяем, является ли ответ кодом
    const type = content.includes('```') ? 'code' : 'text';
    
    return {
      role: 'assistant',
      content,
      type
    };
  } catch (error) {
    console.error('Ошибка API OpenAI:', error);
    return {
      role: 'assistant',
      content: 'Произошла ошибка при обращении к OpenAI. Пожалуйста, проверьте ваш API ключ или попробуйте позже.',
      type: 'text'
    };
  }
};

// Функция для генерации изображения
export const generateImage = async (prompt: string): Promise<MessageType> => {
  try {
    const response = await fetch('https://api.openai.com/v1/images/generations', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: 'dall-e-3',
        prompt,
        n: 1,
        size: '1024x1024',
        quality: 'standard'
      })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error?.message || 'Ошибка при генерации изображения');
    }

    const data = await response.json() as OpenAIImageResponse;
    const imageUrl = data.data[0]?.url;
    
    return {
      role: 'assistant',
      content: 'Вот сгенерированное изображение:',
      type: 'image',
      imageUrl
    };
  } catch (error) {
    console.error('Ошибка при генерации изображения:', error);
    return {
      role: 'assistant',
      content: 'Не удалось сгенерировать изображение. Пожалуйста, проверьте ваш API ключ или попробуйте другой запрос.',
      type: 'text'
    };
  }
};

// Функция для анализа файла
export const analyzeFile = async (file: File): Promise<MessageType> => {
  try {
    // Если файл слишком большой, отклоняем
    if (file.size > 5 * 1024 * 1024) {
      return {
        role: 'assistant',
        content: 'Файл слишком большой. Максимальный размер файла - 5 МБ.',
        type: 'text'
      };
    }
    
    // Чтение содержимого файла
    const fileContent = await file.text().catch(() => null);
    
    if (!fileContent) {
      return {
        role: 'assistant',
        content: 'Не удалось прочитать содержимое файла. Пожалуйста, убедитесь, что файл является текстовым документом.',
        type: 'text'
      };
    }
    
    // Отправка содержимого файла на OpenAI для анализа
    const messages: MessageType[] = [
      { role: 'system', content: 'Вы - помощник, который анализирует содержимое файлов.' },
      { role: 'user', content: `Пожалуйста, проанализируйте содержимое файла ${file.name}:\n\n${fileContent}` }
    ];
    
    return await generateTextResponse(messages);
  } catch (error) {
    console.error('Ошибка при обработке файла:', error);
    return {
      role: 'assistant',
      content: 'Произошла ошибка при обработке файла. Пожалуйста, попробуйте еще раз.',
      type: 'text'
    };
  }
};
