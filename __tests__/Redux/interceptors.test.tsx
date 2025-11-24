
import axios from "axios";

jest.mock('axios');

describe("Axios Interceptors", () => {
    let mockAxiosInstance: any;
    beforeEach(() => {
        jest.clearAllMocks();
        mockAxiosInstance = {
            interceptors: {
                request: { use: jest.fn() },
                response: { use: jest.fn() }
            }
        };

        (axios.create as jest.Mock).mockReturnValue(mockAxiosInstance);

        localStorage.setItem("token", "abc123");

        jest.isolateModules(() => {
            require("../../Redux/interceptors");
        });
    });

    it("should add Authorization header in request interceptor", async () => {
        const requestInterceptor =
            mockAxiosInstance.interceptors.request.use.mock.calls[0][0];

        expect(typeof requestInterceptor).toBe("function");
        const config = { headers: {} };
        const updated = requestInterceptor(config);
        expect(updated.headers.Authorization).toBe("Bearer abc123");



    });


    it("should request interceptor error handling and without token also  tested", async () => {
        const requestInterceptor =
            mockAxiosInstance.interceptors.request.use.mock.calls[0][0];
        //Error handling
        const requestInterceptorError =
            mockAxiosInstance.interceptors.request.use.mock.calls[0][1];

        const mockError = new Error("request failed");
        await expect(requestInterceptorError(mockError)).rejects.toThrow("request failed");

        //Without token line also cover
        localStorage.clear();
        const configClear = { headers: {} };
        const updatedClear = requestInterceptor(configClear);
        expect(updatedClear.headers.Authorization).toBeUndefined();
    })

    it('should pass through successful responses', async () => {
        const success = mockAxiosInstance.interceptors.response.use.mock.calls[0][0];
        const mockResponse = { data: 123 };
        expect(success(mockResponse)).toBe(mockResponse);

        const error = mockAxiosInstance.interceptors.response.use.mock.calls[0][1];
        const mockError = new Error("fail");
        await expect(error(mockError)).rejects.toThrow("fail");
    });
})


