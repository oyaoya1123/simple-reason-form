import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useToast } from "@/hooks/use-toast";

import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";

// バリデーションスキーマの定義
const formSchema = z.object({
  reason: z.enum(["family", "other"], {
    required_error: "変更事由を選択してください",
  }),
  familyDetails: z.string().max(50, {
    message: "50文字以内で入力してください",
  }).optional(),
  otherDetails: z.string().max(200, {
    message: "200文字以内で入力してください",
  }).optional(),
  improvement: z.string().max(200, {
    message: "200文字以内で入力してください",
  }).optional(),
  comments: z.string().max(200, {
    message: "200文字以内で入力してください",
  }).optional(),
}).refine((data) => {
  // 家庭の事情が選択されている場合は具体的内容が必須
  if (data.reason === "family") {
    return !!data.familyDetails;
  }
  return true;
}, {
  message: "具体的内容を入力してください",
  path: ["familyDetails"],
}).refine((data) => {
  // その他が選択されている場合は詳細が必須
  if (data.reason === "other") {
    return !!data.otherDetails;
  }
  return true;
}, {
  message: "詳細を入力してください",
  path: ["otherDetails"],
});

type FormValues = z.infer<typeof formSchema>;

const Index = () => {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  
  // フォームの初期化
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      reason: undefined,
      familyDetails: "",
      otherDetails: "",
      improvement: "",
      comments: "",
    },
  });

  // フォーム送信処理
  const onSubmit = async (values: FormValues) => {
    try {
      setIsSubmitting(true);
      console.log(values);
      
      // 送信の遅延をシミュレート (実際のAPIリクエストを代わりに使用する)
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      // 送信成功時のトースト通知
      toast({
        title: "送信完了",
        description: "退会理由が正常に送信されました。",
      });
      
      // 送信完了画面へ遷移
      setIsSubmitted(true);
    } catch (error) {
      // エラー発生時のトースト通知
      toast({
        title: "エラーが発生しました",
        description: "送信に失敗しました。もう一度お試しください。",
        variant: "destructive",
      });
      console.error("送信エラー:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // 送信完了画面
  if (isSubmitted) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4">
        <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-8 text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">送信完了</h1>
          <p className="text-gray-600 mb-6">
            退会理由が送信されました。ご協力ありがとうございました。
          </p>
          <Button
            onClick={() => setIsSubmitted(false)}
            variant="outline"
            className="mx-auto"
          >
            フォームに戻る
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">退会理由フォーム</h1>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* 変更事由 - ラジオボタン */}
            <FormField
              control={form.control}
              name="reason"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormLabel className="text-base font-semibold">
                    変更事由 <span className="text-red-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      value={field.value}
                      className="flex flex-col space-y-3"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="family" id="family" />
                        <FormLabel htmlFor="family" className="font-normal cursor-pointer">
                          家庭の事情
                        </FormLabel>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="other" id="other" />
                        <FormLabel htmlFor="other" className="font-normal cursor-pointer">
                          その他
                        </FormLabel>
                      </div>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* 家庭の事情の具体的内容 - 条件付き表示 */}
            {form.watch("reason") === "family" && (
              <FormField
                control={form.control}
                name="familyDetails"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      具体的内容 <span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="具体的内容を入力してください" 
                        {...field} 
                        maxLength={50}
                      />
                    </FormControl>
                    <FormDescription className="text-right">
                      {field.value?.length || 0}/50文字
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            {/* その他の場合の詳細 - 条件付き表示 */}
            {form.watch("reason") === "other" && (
              <FormField
                control={form.control}
                name="otherDetails"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      詳細 <span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="詳細を入力してください"
                        className="resize-none"
                        {...field} 
                        maxLength={200}
                      />
                    </FormControl>
                    <FormDescription className="text-right">
                      {field.value?.length || 0}/200文字
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            {/* 改善要望 - 任意 */}
            <FormField
              control={form.control}
              name="improvement"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>改善要望（任意）</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="サービスの改善についてご意見がございましたら、ご記入ください"
                      className="resize-none"
                      {...field} 
                      maxLength={200}
                    />
                  </FormControl>
                  <FormDescription className="text-right">
                    {field.value?.length || 0}/200文字
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* その他コメント - 任意 */}
            <FormField
              control={form.control}
              name="comments"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>その他コメント（任意）</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="その他、何かございましたらご記入ください"
                      className="resize-none"
                      {...field} 
                      maxLength={200}
                    />
                  </FormControl>
                  <FormDescription className="text-right">
                    {field.value?.length || 0}/200文字
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* 送信ボタン */}
            <Button 
              type="submit" 
              className="w-full"
              disabled={isSubmitting}
            >
              {isSubmitting ? "送信中..." : "送信する"}
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default Index;
